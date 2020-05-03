FROM golang as builder

# RUN go get -v github.com/robustperception/pushprox && \
#     cd ${GOPATH-$HOME/go}/src/github.com/robustperception/pushprox/proxy && \
#     go build && \
#     cd ${GOPATH-$HOME/go}/src/github.com/robustperception/pushprox/client && \
#     go build 

RUN git clone https://github.com/robustperception/pushprox.git && cd pushprox && make build

ENTRYPOINT /go/bin/proxy

FROM registry.access.redhat.com/ubi8-minimal
COPY --from=builder /go/bin/proxy .
COPY --from=builder /go/bin/client .
EXPOSE 8080
CMD ["./proxy"]
