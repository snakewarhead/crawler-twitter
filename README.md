# crawler-twitter

## env config

TWITTERS = name0,name1-translation,name2

> name: url path
>
> translation: 0 - disable, 1 - enable

## selenium

### cookies

export cookies from the extension called 'Cookie Quick Manager' of firefox

### selenium grid

```cmd
docker run -d -p 192.168.1.105:4444:4444 -p 192.168.1.105:7900:7900 --name selenium-chrome --shm-size="2g" selenium/standalone-chrome:4.3.0-20220706
```

run the browser headlessly if disabling XVFB

```cmd
docker run -d -p 192.168.1.105:4444:4444 -e SE_NODE_MAX_SESSIONS=2 -e START_XVFB=false -e SE_START_XVFB=false --name selenium-chrome-headless --shm-size="2g" selenium/standalone-chrome:4.3.0-20220706
```
