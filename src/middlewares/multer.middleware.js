import multer from "multer";

// we have two options to do so - using the DISKSTORAGE OR MEMORY(not good for large files)

const storage = multer.diskStorage({
        destination: function (req, file, cb) {
        cb(null, './public/temp')
    },
        filename: function (req, file, cb) {
            //to make the file name unique according to our need
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)

            // we can also write the file name as file.fieldname + '-' + uniqueSuffix( if want the uniqueness)
            // otherwise can also write the original file name by which the user have uploaded the file
        cb(null, file.originalname)

        // wil also the local path name which we can use to upload the file o the cloudinary
    }
})

export const upload = multer({ 
    storage 
})