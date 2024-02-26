        const express = require('express');
        const app = express();
        import { jsPDF } from "jspdf";

        // Default export is a4 paper, portrait, using millimeters for units
        const doc = new jsPDF();

        doc.text("Hello world!", 10, 10);
        doc.save("a4.pdf");


        // Middleware to parse JSON bodies
        app.use(express.json());

        app.post('/estimate', (req, res) => {
            const { totalLineCounts } = req.body;

            // Calculate values for other columns based on the total line counts
            const totalNumberExpectedPID = Math.ceil(totalLineCounts / 2);
            const sumBendsTeesReducer = totalLineCounts * 6;
            const totalNumberValvesPID = totalLineCounts * 3;
            const totalEquipmentsPID = Math.ceil(totalLineCounts * 0.4); // Assuming the same value as totalNumberValvesPID
            const totalLineSegmentsPerLine = totalLineCounts + sumBendsTeesReducer + totalLineSegmentsPerLine;
            

            // Send the calculated values as a response
            res.status(200).json({
                totalNumberExpectedPID,
                sumBendsTeesReducer,
                totalNumberValvesPID,
                totalEquipmentsPID,
                totalLineSegmentsPerLine,
            
            });
        });

        const port = process.env.PORT || 3000;
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
