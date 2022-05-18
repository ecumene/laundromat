mod cli;

use crate::cli::Args;
use clap::Parser;
use static_dir::static_dir;
use warp::Filter;
use warp_reverse_proxy::reverse_proxy_filter;

const SPIN_HOME: &str = ".spin";
const THIS_DIR: &str = "./";

#[tokio::main]
async fn main() {
    let args = Args::parse();

    let static_files = warp::path::end().and(static_dir!("../dist"));
    let static_assets = warp::path("assets").and(static_dir!("../dist/assets"));

    let spin_logs_dir = dirs::home_dir()
        .map(|home| home.join(SPIN_HOME))
        .expect("Could not find home directory");

    // .spin/*
    let logs_dir = warp::path("spin").and(warp::fs::dir(spin_logs_dir));
    // ./*
    let this_dir = warp::path("app").and(warp::fs::dir(THIS_DIR));
    // http://127.0.0.1:3000/*
    let proxy = warp::path!("proxy" / ..).and(reverse_proxy_filter(
        "proxy".to_string(),
        args.spin_addr.to_string(),
    ));

    let routes = static_files
        .or(static_assets)
        .or(logs_dir)
        .or(this_dir)
        .or(proxy);

    println!("Listening on http://localhost:3117");

    warp::serve(routes).run(([127, 0, 0, 1], 3117)).await;
}
