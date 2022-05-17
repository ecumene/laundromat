# Laundromat

An indev console for Spin apps.

![A screenshot of an HTTP Read Eval Print Loop where you select routes from a spin app and clicking "send" will give you the output. On the left side of the screen are the spin components, and clicking on them will give you their logs](screenie.png)

## Server breakdown

 - A React app is built into the binary
 - The React app reaches out to the server for resources
 - It reads the current directory for Spin app configuration
 - It reads the Spin home directory for log output
 - It proxies requests to the spin app that's running

![A diagram showing a react app with arrows pointed back and forth with the server it is served from. The server multiplexes to the spin home directory, the current directory, and the spin api](./diagram.svg)

## How to use

Just `cd` into your Spin app, run it with `spin up` and run `laundromat` in a separate tty.

## How to build

1. `yarn build`
2. `cd server && cargo build --release`
3. `mv ./target/release/laundromat /usr/local/bin`
