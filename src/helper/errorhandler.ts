import logger from './logger';

export default (app: any) => {

    // handle 404
    app.use((req, res: any) => {
        res.api.status = 404;
        res.status(res.api.status);

        // setting appropriate error objects
        res.api.error = {
            name: 'endpoint',
            message: 'API endpoint does not exist',
        };

        logger.error("Method not found", {
            res,
            err: res.api.error,
        });

        res.json(res.api);
    });

    // handle errors
    app.use((err, req, res, next) => {
        if (!err) {
            return next();
        }

        // catch invalid json in request body
        if (err instanceof SyntaxError && 'body' in err) {

            res.api.status = 400;
            res.status(res.api.status);

            // setting appropriate error objects
            res.api.error = {
                code: 'body',
                message: 'Invalid input',
            };

            logger.error("Not able to parse the request body", {
                res,
                err,
            });

            return res.json(res.api);
        }

        // setting appropriate error objects
        res.api.error = {
            code: 'endpoint',
            message: 'Oops something broke!',
        };

        res.api.status = 500;
        res.status(res.api.status);

        logger.error("Unhandled exception occured", {
            res,
            err,
        });

        res.json(res.api);
    });

};
