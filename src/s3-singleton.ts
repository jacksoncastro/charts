import AWS from 'aws-sdk';

const ACCESS_KEY = process.env.ACCESS_KEY;
const SECRET_KEY = process.env.SECRET_KEY;
const BUCKET_NAME = 'hipstershop-k6';
// const BUCKET_NAME = 'blueperf-k6';

class S3Bucket {

    private static s3: AWS.S3;

    private static buildS3(): AWS.S3 {
        return new AWS.S3({
            accessKeyId: ACCESS_KEY,
            secretAccessKey: SECRET_KEY
        });
    }

    private static getS3(): AWS.S3 {
        if (!this.s3) {
            this.s3 = this.buildS3();
        }
        return this.s3;
    }

    public static getObjectS3(key: string): Promise<string> {

        const parameters = {
            Bucket: BUCKET_NAME,
            Key: key
        };

        return new Promise((resolve, reject) => {
            this.getS3().getObject(parameters, (error, data) => {
                if (error) {
                    reject(error);
                }

                if (data && data.Body) {
                    resolve(data.Body.toString('utf-8'));
                } else {
                    reject(new Error('Empty body'));
                }
            });
        });
    }

    public static listObjects(prefix: string): Promise<string[]> {

        const parameters = {
            Bucket: BUCKET_NAME,
            Prefix: prefix
        };

        return new Promise((resolve, reject) => {
            this.getS3().listObjectsV2(parameters, (error, data) => {
                if (error) {
                    reject(error);
                }

                try {
                    const keys = data.Contents.map(item => item.Key);
                    resolve(keys);
                } catch(error) {
                    reject(error);
                }
            });
        });

    }
}

export default S3Bucket;
