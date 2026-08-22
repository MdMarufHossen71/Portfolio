# deploy/

Files that are ready to use but must **not** be active yet.

## `CNAME`

GitHub Pages reads a file called `CNAME` at the root of the published site and
treats its contents as the site's custom domain. That means dropping it into
`public/` has two immediate effects:

1. Pages starts expecting `mdmarufhossen.link` to point at it, and
2. `.github/workflows/deploy-pages.yml` sees `public/CNAME` and builds with a base
   path of `/` instead of `/Portfolio/`.

Both are correct — **once DNS is configured**. Before that, activating it would
break the `https://mdmarufhossen71.github.io/Portfolio/` URL without giving you a
working custom domain in exchange. So it waits here.

### Activating it

Do the DNS half first, at your domain registrar:

| Type    | Name  | Value                        |
| ------- | ----- | ---------------------------- |
| `A`     | `@`   | `185.199.108.153`            |
| `A`     | `@`   | `185.199.109.153`            |
| `A`     | `@`   | `185.199.110.153`            |
| `A`     | `@`   | `185.199.111.153`            |
| `CNAME` | `www` | `mdmarufhossen71.github.io.` |

Those four apex addresses are GitHub's published Pages IPs — confirm them against
[GitHub's own documentation](https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
before entering them, in case they have changed.

Then, once `dig mdmarufhossen.link +short` returns those addresses:

```bash
cp deploy/CNAME public/CNAME
```

Commit it and push. The next Pages deploy builds at base `/` and serves from the
custom domain. Leave **Enforce HTTPS** ticked in Settings → Pages once the
certificate has been issued (it can take a few minutes).

### If you would rather not move the file

Set a repository variable instead — Settings → Secrets and variables → Actions →
Variables → `PAGES_BASE_PATH` = `/`. The workflow prefers that variable over
everything else. You still need `public/CNAME` for Pages to know the domain, so
this is the escape hatch for base-path problems, not a replacement for the file.
