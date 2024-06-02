const whitelist = [
    'http://localhost:3000',
    'https://cowhelper-dev.azurewebsites.net/'
    //'http://127.0.0.1:5500' //react app using "GoLive",
    
];

const corsOptions = {
    origin: (origin, callback) =>{
        console.log(`[Log]\tOrigin: ${origin}`)
        //remove !origin before production deployment
        if (whitelist.indexOf(origin) !== -1 || !origin){
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    optionsSuccessStatus: 200
}

module.exports = corsOptions;