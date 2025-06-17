class ApiResponse {
    constructor(statsusCode, data, message = "success") {
        this.statsusCode = statsusCode;
        this.message = message;
        this.success = statsusCode < 400;
        this.data = data;

    }
}

export { ApiResponse }