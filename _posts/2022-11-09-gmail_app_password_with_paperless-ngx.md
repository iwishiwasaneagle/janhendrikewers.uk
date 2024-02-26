---
layout: post
title: Using GMail's App Passwords With Paperless-NGX
date: '2022-10-09'
categories: post
tags:
  - paperless-ngx
  - gmail
  - self-hosted
---

I saw some errors in my paperless-ngx logs recently:

```log
[2022-11-09 15:33:13,556] [ERROR] [paperless_mail] 
  Error while authenticating account paperless gmail: 
    Response status "OK" expected, but "NO" received. 
    Data: [b'[AUTHENTICATIONFAILED] Invalid credentials (Failure)']
```

After doing some digging, I discovered the following that will be affecting a lot of Paperless-ngx users with dedicated gmail accounts for ingress.

As of 30/05/2022, [Google stopped supporting the _Less Secure Apps_ mode](https://support.google.com/accounts/answer/6010255) which was often used to enable Paperless-NG to work with GMail via IMAP. Now, you need to enable 2FA and then generate an _App Password_ (with instructions [here](https://support.google.com/accounts/answer/185833)). This password is then used within paperless-ngx like the account password previously.

For more guidance on how to set up Paperless-ngx with automated email ingress and rules, have a look at my other articles 
  - [Paperless-ng On Raspberry Pi With Email And Samba]({% post_url 2021-09-25-paperless-ng_on_localy_hosted_rpi %})
  - [Upgrading from Paperless-NG to Paperless-NGX]({% post_url 2022-03-21-upgrading_from_paperless-ng_to_paperless_ngx %})

## Tips

1. Make sure to select **Mail** as the app type. You'll then want to select _Other Custom Name_ for the device type.
![B](/static/img/2022-11-09_gmail_with_paperless-ngx/2.png)
2. Make sure to use a meaningful name
![C](/static/img/2022-11-09_gmail_with_paperless-ngx/3.png)
3. The app password is only ever shown once so make sure to copy it there and then. It is made up of 16 characters. **DO NOT SHARE OR RE-USE THIS PASSWORD**
![D](/static/img/2022-11-09_gmail_with_paperless-ngx/4.png)