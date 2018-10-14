use log4rs;

pub fn configure_logger() {
    use log4rs::append::console::ConsoleAppender;
    use log4rs::append::file::FileAppender;
    use log4rs::encode::pattern::PatternEncoder;
    use log4rs::config::{Appender, Config, Logger, Root};
    use log::LogLevelFilter;
    let date_pattern = "{d(%H:%M:%S)}";
    let src_pattern = r"{h({l:<2.2})}";
    let msg_pattern = r"{m}{n}";

    let stdout_appender = ConsoleAppender::builder()
        .encoder(Box::new(PatternEncoder::new(&format!("{}-{} {}", date_pattern, src_pattern, msg_pattern))))
        .build();

    let filter = LogLevelFilter::Info;

    let trader_logger = Logger::builder()
        .appender("stdout")
        .additive(false)
        .build("trader", filter);

    let daemon_logger = Logger::builder()
        .appender("stdout")
        .additive(false)
        .build("daemon", filter);

    let db_logger = Logger::builder()
        .appender("stdout")
        .additive(false)
        .build("db", filter);

    let common_logger = Logger::builder()
        .appender("stdout")
        .additive(false)
        .build("common", filter);

    let root = Root::builder()
        .appender("stdout")
        .build(LogLevelFilter::Warn);


    let mut config = log4rs::config::Config::builder()
        .appender(
            Appender::builder().build("stdout", Box::new(stdout_appender))
        )
        .logger(trader_logger)
        .logger(daemon_logger)
        .logger(db_logger)
        .logger(common_logger)
        .build(root).unwrap();


    log4rs::init_config(config).unwrap();
}