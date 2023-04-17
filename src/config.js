const loglevel = process.env.LOGLEVEL || "trace";

module.exports = {
    dbConfig: {
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "root",
        database: process.env.DB_DATABASE || "programmeren-4",
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT || 3306,
        multipleStatements: true,
        connectionLimit: 10,
        waitForConnections: true,
        queueLimit: 0,
        idleTimeout: 10000,
        maxIdle: 10,
        maxActive: 10,
    },

    // dbTestConfig: {
    //   host: process.env.TEST_DB_HOST,
    //   user: process.env.TEST_DB_USER,
    //   database: process.env.TEST_DB,
    //   user: process.env.TEST_DB_USER
    // },

    jwtSecretKey: process.env.SECRET,
    logger: require("tracer").console({
        format: ["{{timestamp}} [{{title}}] {{file}}:{{line}} : {{message}}"],
        preprocess: function(data) {
            data.title = data.title.toUpperCase();
        },
        dateformat: "isoUtcDateTime",
        level: loglevel
    })
};