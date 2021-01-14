# README #

This is the generic starter theme for Shopify themes built on Slate v1 for FutureShirts. Most themes are either direct descendents of a version of this theme, or share heavy amounts of code with this theme.

## Caveats ##

It's important to note that *Shopify no longer supports Slate v1*. So at some point, this will only be a legacy tool. Hopefully, there'll be a way to continue using their new toolset, but for the time being, this is much better than old ThemeKit, and it may be forked in order to enable updates.

I attempt to update this theme when I add a new feature to its descendents. I try also to leave most updates non-destructive, and somewhat backwards-compatible. That said, updating an old theme to a newer version of the starter will always be a __manual process__, but copying code is better than re-writing!

## Using Slate ##

Slate (v1) can be found [here](https://shopify.github.io/slate/docs/about). Yes, it's at end-of-support, but it's actually usable still and can't really be beat at the moment.

- It's based around Webpack, and can be extended that way, but also has the same learning curve
- It's out of date, so it can only use Babel 6.26.3 for the moment, which is a problem I know! Luckily babel docs are still there for ver 6
- It also has to use NPM v11, not 12+. So make sure you're using `nvm use 11.0` or something like that.
- It has some odd behavior with image assets in CSS, so I avoid that for the most part. You can use them in .liquid files, but I never have luck using them in css files. Probably better to keep them configurable on the customizer anyway.
- It also has trouble with local SSL, so I manually accept the certificates after using mkcert as they direct you to in the Docs.
- I have never had success splitting code chunks too much, it doesn't seem to like that, so your bundles will be quite large (> 450kb). I think this is because the script tag in the theme.liquid file doesn't want to load too dynamically. That said, it's still pretty fast

## Using my theme! ##
I've made some customizations that I think are worth it.

- Please use the /scripts/modules folder for creating bundled code tied to html blocks. Then use `data-module=module-name` to load the code on a page.


