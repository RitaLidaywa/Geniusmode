# Tiri website

Static, multi-page site for Tiri (writing services + Pata Creative Studio), built with plain HTML, CSS, and vanilla JavaScript. No build step required.

## Structure

- `index.html` — homepage (hero, services, Pata Creative Studio, portfolio carousel, about, testimonial slot, contact)
- `prose.html`, `primer.html`, `paperwork.html` — individual service pages with pricing tables
- `portfolio/` — five individual portfolio piece pages, each with an image lightbox gallery
- `css/styles.css` — shared stylesheet (light/dark theme via CSS variables + `data-theme`)
- `js/main.js` — theme toggle, typewriter effect, scroll fade-ins, mobile nav, carousel, lightbox, form validation, and geo-based currency detection

## Local preview

Open `index.html` directly in a browser, or serve the folder with any static file server, e.g.:

```
npx serve .
```

## Contact form

The contact form is structured for [Netlify Forms](https://docs.netlify.com/manage/forms/setup/) (`data-netlify="true"`, hidden `form-name` input, honeypot field). When deployed on Netlify, remove the `data-demo-mode="true"` attribute on the form so submissions go through Netlify's handler instead of the local demo success message.

## Currency detection

Service page pricing tables detect the visitor's country via `https://get.geojs.io/v1/ip/country.json`. Visitors from Kenya (`KE`) see KSh pricing; everyone else, and any visitor if the lookup fails, sees USD. Visitors can also switch manually with the currency toggle.
