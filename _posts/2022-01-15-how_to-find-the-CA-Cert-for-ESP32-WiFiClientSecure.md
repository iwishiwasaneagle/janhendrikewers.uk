---
layout: post
title: How To Find The CA Certificate For ESP32's WiFiClientSecure
date: '2022-01-15'
categories: post
tags:
  - arduino
  - esp32
  - ssl
---

I just spent the last 2 hours trawling through source code (whilst getting increasingly annoyed) to figure out where the f**k the CA Certificate comes from. Initially I thought I could use the one from the browser, but that didn't work. So finally I came across a StackOverflow comment saying to use `openssl`. Hopefully this short post will enlighten some other frustrated soul!

This is an example for [www.howsmyssl.com](www.howsmyssl.com) so you must change the address in the command as you require. The correct cert in this example it to pick the 3rd one in the chain, with `i:0 = Digital Signature Trust Co.` as it is the parent certificate.

```raw
$ openssl s_client -showcerts -connect www.howsmyssl.com:443

depth=2 C = US, O = Internet Security Research Group, CN = ISRG Root X1
verify return:1
depth=1 C = US, O = Let's Encrypt, CN = R3
verify return:1
depth=0 CN = www.howsmyssl.com
verify return:1
CONNECTED(00000003)
---
Certificate chain
 0 s:CN = www.howsmyssl.com
   i:C = US, O = Let's Encrypt, CN = R3
-----BEGIN CERTIFICATE-----
MIIEjjCCA3agAwIBAgISAw52tGoJJ5UGAMFO9pgNYc54MA0GCSqGSIb3DQEBCwUA
[ SKIP ]
xLf867GFF3XWYINKrnyduixX
-----END CERTIFICATE-----
 1 s:C = US, O = Let's Encrypt, CN = R3
   i:C = US, O = Internet Security Research Group, CN = ISRG Root X1
-----BEGIN CERTIFICATE-----
MIIFFjCCAv6gAwIBAgIRAJErCErPDBinU/bWLiWnX1owDQYJKoZIhvcNAQELBQAw
[ SKIP ]
nLRbwHOoq7hHwg==
-----END CERTIFICATE-----
 2 s:C = US, O = Internet Security Research Group, CN = ISRG Root X1
   i:O = Digital Signature Trust Co., CN = DST Root CA X3               <--- CHOSE THIS ONE WITH "Digital Signature Trust Co." LINE
-----BEGIN CERTIFICATE-----
MIIFYDCCBEigAwIBAgIQQAF3ITfU6UK47naqPGQKtzANBgkqhkiG9w0BAQsFADA/
[ SKIP ]
Dfvp7OOGAN6dEOM4+qR9sdjoSYKEBpsr6GtPAQw4dy753ec5
-----END CERTIFICATE-----
...
```

Then in your C++ code, use it as shown below:

```c++
const char promCert[] = \
"-----BEGIN CERTIFICATE-----\n" \
"MIIFYDCCBEigAwIBAgIQQAF3ITfU6UK47naqPGQKtzANBgkqhkiG9w0BAQsFADA/\n" \
...
"Dfvp7OOGAN6dEOM4+qR9sdjoSYKEBpsr6GtPAQw4dy753ec5\n" \
"-----END CERTIFICATE-----\n";
```

It's very important to ensure that you have copy/pasted the cert **EXACTLY** as it was shown with `openssl`. That includes the begin, and end certificate lines For a complete example, have a look at the [official example][1].

  [1]: https://github.com/espressif/arduino-esp32/blob/master/libraries/WiFiClientSecure/examples/WiFiClientSecure/WiFiClientSecure.ino#L20-L40