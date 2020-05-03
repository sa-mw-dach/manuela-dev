FROM golang:1.9-stretch

RUN go get github.com/robustperception/pushprox/proxy && \
    cd ${GOPATH-$HOME/go}/src/github.com/robustperception/pushprox/proxy && \
    go build 

RUN go get github.com/robustperception/pushprox/client && \
    cd ${GOPATH-$HOME/go}/src/github.com/robustperception/pushprox/client && \
    go build 

ENTRYPOINT /go/bin/proxy
