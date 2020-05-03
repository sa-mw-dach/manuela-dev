FROM golang as builder

RUN go get github.com/robustperception/pushprox/proxy && \
    cd ${GOPATH-$HOME/go}/src/github.com/robustperception/pushprox/proxy && \
    go build 

RUN go get github.com/robustperception/pushprox/client && \
    cd ${GOPATH-$HOME/go}/src/github.com/robustperception/pushprox/client && \
    go build 

ENTRYPOINT /go/bin/proxy

FROM registry.access.redhat.com/ubi8-minimal
COPY --from=builder /go/bin/proxy .
COPY --from=builder /go/bin/client .
EXPOSE 8080
CMD ["./proxy"]
