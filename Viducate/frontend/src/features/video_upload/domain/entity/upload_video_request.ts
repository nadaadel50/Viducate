    export class UploadVideoRequest {
    file: File;
    filename: string;
    title: string;
    language: string;
    subject: string;
    content_type: string;

    constructor(
         file:File,
        filename: string,
        title: string,
        language: string,
        subject: string,
        content_type: string
    ) {
        this.file=file
        this.filename = filename;
        this.title = title;
        this.language = language;
        this.subject = subject;
        this.content_type = content_type;
    }
    }