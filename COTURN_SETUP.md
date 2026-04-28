# Self-Hosted coturn TURN Server Setup

A step-by-step guide to replace the public Open Relay free TURN with our own
**coturn** (BSD-licensed, open-source) deployment. A non-DevOps person should
be able to follow this end-to-end.

---

## Why TURN is needed

WebRTC works peer-to-peer for ~80% of users via STUN alone. The remaining
~20% sit behind **symmetric NAT** (typical scenario: a doctor on mobile data
calling a peer on home Wi-Fi or a hospital firewall) where neither side can
discover a routable path to the other. For those users WebRTC silently fails
— peers appear "online" but video stays black forever. A TURN server fixes
this by **relaying** the encrypted media stream through a public IP, which
works for 99%+ of NATs and even most corporate proxies (when run over TLS on
TCP/443-style ports).

---

## Provider recommendation

| Provider | Plan | Cost | Specs | Notes |
|---|---|---|---|---|
| **Hetzner** (recommended) | CPX11 | ~₹400-500 / month (€4.51) | 2 vCPU, 2 GB RAM, 40 GB SSD, **1 Gbps unmetered** | Best price/perf for TURN. Unmetered traffic = no surprise bills. Pick the Falkenstein/Nuremberg DC for AU latency parity, or Singapore once Hetzner adds APAC. |
| Fly.io (alternative) | shared-cpu-1x, 256 MB | $5-10 / month | Anycast network, simpler deploy | Bandwidth-metered (160 GB free, then $0.02/GB outbound). Fine for very low traffic, can get pricey at scale. |

We will use **Hetzner CPX11 + Ubuntu 22.04 LTS** below.

---

## Step 1 — Provision the VPS

1. Sign up at [hetzner.com/cloud](https://www.hetzner.com/cloud).
2. Create a new server:
   - Image: **Ubuntu 22.04**
   - Type: **CPX11** (AMD, 2 vCPU, 2 GB RAM)
   - Location: closest to your users
   - Add your SSH key
3. Note the public IPv4 address — call it `<VPS_IP>` from here on.

SSH in:

```bash
ssh root@<VPS_IP>
apt update && apt upgrade -y
apt install -y docker.io docker-compose-plugin certbot ufw
```

---

## Step 2 — DNS

In your domain registrar (Namecheap, Cloudflare, etc.) for `mostlymedicine.com`,
add an **A record**:

| Type | Host | Value | TTL |
|---|---|---|---|
| A | `turn` | `<VPS_IP>` | 300 |

Wait ~2 minutes, then verify:

```bash
dig +short turn.mostlymedicine.com
# should print <VPS_IP>
```

> **Cloudflare users**: set the proxy to **DNS only** (grey cloud). TURN
> traffic is not HTTP and Cloudflare's proxy will break it.

---

## Step 3 — TLS certificate (Let's Encrypt)

TURN-over-TLS (port 5349) is what corporate firewalls allow through. We need
a real cert.

```bash
# Stop anything on port 80 first
ufw allow 80/tcp
certbot certonly --standalone -d turn.mostlymedicine.com \
  --agree-tos -m kamboj.chetan18@gmail.com --non-interactive
```

Certs land in `/etc/letsencrypt/live/turn.mostlymedicine.com/`.

Set up auto-renewal (already a systemd timer on Ubuntu 22.04, just verify):

```bash
systemctl status certbot.timer
```

Add a renewal hook so coturn picks up new certs without restart hassle.
Create `/etc/letsencrypt/renewal-hooks/deploy/coturn-reload.sh`:

```bash
#!/bin/bash
docker restart coturn
```

```bash
chmod +x /etc/letsencrypt/renewal-hooks/deploy/coturn-reload.sh
```

---

## Step 4 — Firewall (ufw)

```bash
ufw allow 22/tcp           # SSH
ufw allow 80/tcp           # certbot renewals
ufw allow 3478/udp         # STUN/TURN
ufw allow 3478/tcp         # STUN/TURN
ufw allow 5349/udp         # STUN/TURN over TLS
ufw allow 5349/tcp         # STUN/TURN over TLS
ufw allow 49152:65535/udp  # TURN media relay (dynamic range)
ufw --force enable
ufw status verbose
```

---

## Step 5 — `turnserver.conf`

Create `/etc/coturn/turnserver.conf` on the VPS. **Generate a strong password
and rotate it; do NOT commit this file to git.**

```ini
# /etc/coturn/turnserver.conf
# IMPORTANT: rotate STRONG_PASSWORD_HERE before going live, and keep this file
# out of version control. Treat it like a secret.

listening-port=3478
tls-listening-port=5349

# Replace with the public IPv4 of the VPS (the same value as the A record).
external-ip=<VPS_IP>

# Realm shown to clients; matches our domain.
realm=mostlymedicine.com

# Long-term credential mechanism — required for username/password auth.
lt-cred-mech
user=mostlymedicine:STRONG_PASSWORD_HERE

# Let's Encrypt certs (renewed automatically by certbot.timer).
cert=/etc/letsencrypt/live/turn.mostlymedicine.com/fullchain.pem
pkey=/etc/letsencrypt/live/turn.mostlymedicine.com/privkey.pem

# Dynamic media relay port range.
min-port=49152
max-port=65535

# Hardening / behaviour flags.
no-tcp-relay
mobility
fingerprint

# Optional but recommended:
no-multicast-peers
no-cli
no-loopback-peers
stale-nonce=600

# Logging — small, helps debug auth failures without filling disk.
log-file=/var/log/turnserver.log
simple-log
```

Generate a real password (32-char random) and substitute it in:

```bash
openssl rand -base64 32
# example output: p7N2k4...long...random==
sed -i 's|STRONG_PASSWORD_HERE|<paste-here>|' /etc/coturn/turnserver.conf
```

Save the password — you'll paste it into Vercel as
`NEXT_PUBLIC_TURN_CREDENTIAL` in Step 7.

---

## Step 6 — Run coturn via Docker Compose

Create `/root/coturn/docker-compose.yml`:

```yaml
services:
  coturn:
    image: coturn/coturn:latest
    container_name: coturn
    restart: unless-stopped
    # network_mode: host is required because TURN allocates ephemeral UDP
    # ports in the 49152-65535 range; bridged Docker networking would need
    # all 16k ports forwarded, which is impractical.
    network_mode: host
    volumes:
      - /etc/coturn/turnserver.conf:/etc/coturn/turnserver.conf:ro
      - /etc/letsencrypt:/etc/letsencrypt:ro
      - /var/log:/var/log
    command: ["-c", "/etc/coturn/turnserver.conf"]
```

Bring it up:

```bash
cd /root/coturn
docker compose up -d
docker logs -f coturn
```

You should see lines like:

```
0: log file opened: /var/log/turnserver_2026-04-28.log
0: pid file created: /var/tmp/turnserver.pid
0: IPv4. Listener opened on : <VPS_IP>:3478
0: IPv4. Listener opened on : <VPS_IP>:5349
```

Press Ctrl-C to stop tailing — the container keeps running.

---

## Step 7 — Test the TURN server

Open this in your browser:

> https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/

Fill in:

- **STUN or TURN URI**: `turns:turn.mostlymedicine.com:5349?transport=tcp`
- **TURN username**: `mostlymedicine`
- **TURN password**: the password from Step 5

Click **Add Server**, then **Gather candidates**.

You're looking for a row with **Type = relay** (and Component = 1, Foundation
not empty). If you see it, TURN is working. If you only see `host` and `srflx`
candidates and no `relay`, the server isn't reachable — recheck firewall and
`external-ip`.

---

## Step 8 — Wire it into Vercel

In **Vercel → Project Settings → Environment Variables**, add three vars to
**Production** (and Preview if you want preview deploys to use TURN too):

| Name | Value |
|---|---|
| `NEXT_PUBLIC_TURN_URL` | `turns:turn.mostlymedicine.com:5349?transport=tcp` |
| `NEXT_PUBLIC_TURN_USERNAME` | `mostlymedicine` |
| `NEXT_PUBLIC_TURN_CREDENTIAL` | the password from Step 5 |

Why `turns:` (not `turn:`) and `transport=tcp`? Maximum firewall
compatibility — TLS-over-TCP looks like normal HTTPS to deep packet
inspection appliances and gets through where UDP is blocked.

Redeploy the web app after adding the vars (Vercel → Deployments → Redeploy).

The `NEXT_PUBLIC_*` prefix is required because WebRTC ICE config runs in the
browser. These credentials are not super-secret — they only grant relay
allocation, not arbitrary network access — but **rotate them periodically**
(every 90 days or whenever a team member leaves).

---

## Step 9 — Rollback plan

If anything goes wrong (coturn down, cert expired, suspicious traffic),
**immediately** in Vercel:

1. Set `NEXT_PUBLIC_TURN_URL=""` (empty string).
2. Trigger a redeploy.

The client code at `apps/web/src/app/dashboard/ai-roleplay/live/[code]/LiveSessionClient.tsx`
detects the empty TURN URL and falls back to **Google STUN + Open Relay free
TURN**. ~70-80% of users will still connect; the rest get a degraded
experience until coturn is fixed — never a hard outage.

---

## Cost monitoring

**TURN bandwidth math** — each active relayed call uses roughly:

- ~50 KB/s per direction = 100 KB/s round-trip
- = **~6 MB / minute / relayed call**
- = **~360 MB / hour / relayed call**

Hetzner CPX11 includes **20 TB unmetered traffic** at 1 Gbps. That's
~55,000 hours of relayed call-time per month before you'd even notice.
Bigger numbers to keep in mind:

- Only ~20% of calls actually need relay; the other 80% go P2P.
- Practically, you can host **thousands of concurrent users** on a single
  CPX11 before CPU or bandwidth becomes the limit.

When to scale up:

- **CPU > 70% sustained** → bump to CPX21 (3 vCPU, 4 GB).
- **Concurrent allocations > 5000** → CPX21 or run two coturn nodes behind
  a DNS round-robin record.
- **Latency complaints from APAC users** → add a second coturn instance in
  Singapore or Sydney and use `iceServers` array client-side (browser picks
  the lowest-latency one).

Watch usage from the Hetzner Cloud Console → your server → **Graphs**.

---

## Maintenance checklist

| Task | Cadence |
|---|---|
| `apt upgrade -y && reboot` | monthly |
| Check `docker logs coturn` for auth failures / errors | weekly first month, then monthly |
| Rotate `STRONG_PASSWORD_HERE` and update Vercel `NEXT_PUBLIC_TURN_CREDENTIAL` | every 90 days |
| Verify Let's Encrypt auto-renewal: `certbot renew --dry-run` | quarterly |
| Test trickle-ICE page (Step 7) end-to-end | after every coturn upgrade |

---

## Files referenced

- Client ICE config: `apps/web/src/app/dashboard/ai-roleplay/live/[code]/LiveSessionClient.tsx`
- This guide: `COTURN_SETUP.md`
