export const handleDownloadExcel = async (file) => {
    try {
        const response = await fetch(
            `${process.env.VLADIMIR_BASE_URL}/${file}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Accept: " application/json",
                },
            }
        );

        if (!response.ok) {
            // Handle the error if the API response is not successful.
            throw new Error("Failed to download Excel file.");
        }

        const blob = await response.blob();
        saveAs(blob, "Sample.xlsx"); // Specify the filename for the downloaded file.
    } catch (error) {
        console.error("Error while downloading Excel file:", error);
    }
};