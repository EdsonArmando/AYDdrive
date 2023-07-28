docker pull selenium/hub
docker run -d -p 4444:4444 -p 7900:7900 --shm-size="2g" selenium/standalone-firefox:4.0.0-20211013
