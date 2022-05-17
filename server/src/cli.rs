use clap::Parser;

#[derive(Parser, Debug)]
#[clap(author, version, about, long_about = None)]
pub(crate) struct Args {
    #[clap(
        short,
        long,
        help = "The address to /proxy/ to",
        default_value = "http://127.0.0.1:3000"
    )]
    pub(crate) spin_addr: String,
}
