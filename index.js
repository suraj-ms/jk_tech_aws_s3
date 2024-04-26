const { S3Client, GetObjectCommand, PutObjectCommand, ListObjectsV2Command, DeleteObjectCommand, ListBucketsCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3Client = new S3Client({
    region: "ap-south-1",
    credentials: {
        accessKeyId: '',
        secretAccessKey: ''
    }
})

async function getObjectURL(bucketName, key) {
    const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
    })
    const url = await getSignedUrl(s3Client, command);
    return url;
}

async function putObjectURL(bucketName, fileName) {
    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        // contentType: contentType

    })
    const url = await getSignedUrl(s3Client, command);
    return url;
}


async function listS3Buckets() {
    try {
        const command = new ListBucketsCommand({});

        const response = await s3Client.send(command);

        const bucketNames = response.Buckets.map(bucket => bucket.Name);

        bucketNames.forEach(bucketName => {
            console.log(bucketName);
        });
    } catch (err) {
        console.error("Error listing S3 buckets:", err);
    }
}


async function listObjectsInBucket(bucketName) {
    try {
        const command = new ListObjectsV2Command({
            Bucket: bucketName
        });
        const response = await s3Client.send(command);
        const objectKeys = response.Contents.map(object => object.Key);

        console.log(`Objects in bucket '${bucketName}':`);
        console.log("------------------------");
        objectKeys.forEach(objectKey => {
            console.log(objectKey);
        });
    } catch (err) {
        console.error(`Error listing objects in bucket '${bucketName}':`, err);
    }
}


async function deleteObject(key) {
    const command = new DeleteObjectCommand({
        Bucket: 'jk-tech-crud-operation',
        Key: key,
    })
    const result = await s3Client.send(command);
    return result;
}


async function init() {
    let bucketName = "jk-tech-crud-operation";
    console.log("List Buckets Object", await listObjectsInBucket(bucketName));
    // console.log("List Buckets Object",await listS3Buckets());
    // console.log("Get Object: ",await getObjectURL(bucketName,"shivaji creation logo.jpg") );
    // console.log("Put Object: ",await putObjectURL(bucketName,`image-${Date.now()}.jpeg`) );
    // console.log("Delete Object",await deleteObject("image-1714118630435.jpeg") );
}

init();