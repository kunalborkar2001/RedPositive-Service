"use client"

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import AddNew from "../components/AddNew"

import axios from "axios"


export function TableDemo() {
    const [tableData, setTableData] = useState([]);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [updatedData, setUpdatedData] = useState(null)
    const [isChecked, setIsChecked] = useState(false)
    const [selectedData, setSelectedData] = useState([])

    //Data Fetching 
    let dataFetch = async () => {
        const response = await axios.get("https://aggressive-tick-sarong.cyclic.app/api/data");
        let data = await response.data
        setTableData(data)
    }

    useEffect(() => {
        let getData = async () => {
            await dataFetch()
        }
        getData()
        // setTableData(Data)
    }, [])

    const UpdatedForm = (e, useName, id) => {
        let { innerText } = e.target

        setUpdatedData(prevData => ({
            ...prevData,
            _id: id,
            [useName]: innerText
        }));

    }

    const handleUpdate = (id) => {
        setSelectedItemId(id);
        setUpdatedData(null)
    }

    const handleDelete = (id) => {
        // Remove the item from tableData
        setTableData(prevData => prevData.filter(item => item._id !== id));
        // Reset selectedItemId to null
        setSelectedItemId(null);

        // Asynchronously delete the item from the server
        axios.delete(`https://aggressive-tick-sarong.cyclic.app/api/data/${id}`)
            .then(() => {
                console.log("Item deleted successfully");
            })
            .catch(error => {
                console.error("Error deleting item:", error);
                // Handle error
            });
    }


    const checkBoxSelect = (e) => {
        const data = JSON.parse(e.target.value);
        if (e.target.checked) {
            setSelectedData(prevSelectedData => [...prevSelectedData, data]);
        }
        else {
            setSelectedData(prevSelectedData => prevSelectedData.filter(item => item._id !== data._id));
        }
    }

    const sendData = async () => {
        if (selectedData.length) {
            //Make Email API call
            try {
                const response = await axios.post('https://aggressive-tick-sarong.cyclic.app/api/data/send-email', {
                    text: JSON.stringify(selectedData) 
                });
                console.log(response.data);
                alert('Email sent successfully');
            } catch (error) {
                console.error(error.response.data);
                alert('Failed to send email. Please try again later.');
            }
        } else {
            alert('No data selected to send email.');
        }
    }


    const handleUpdatedData = async (id) => {
        // console.log(id)
        try {
            // Make sure updatedData is not null
            if (!updatedData) {
                console.log("no data");
            }

            // Update the item with the changes made
            const response = await axios.put(`https://aggressive-tick-sarong.cyclic.app/api/data/${id}`, updatedData);
            const newData = response.data;

            // Update the tableData state with the updated item
            setTableData(prevData => prevData.map(item => item._id === newData._id ? newData : item));

            // Reset selectedItemId to null
            setSelectedItemId(null);

        } catch (error) {
            console.error("Error updating item:", error);
            // Handle error
        }
    }



    return (
        <div className="w-full">
            <div className="w-full relative">
                <AddNew />
            </div>
            <Table>
                <TableCaption>A list of your recent Data.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>select</TableHead>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Hobbies</TableHead>
                        <TableHead>Update / Delete</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tableData && tableData.length > 0 &&
                        tableData.map((data, idx) => (
                            <TableRow key={data._id}>
                                <TableCell><input type="checkbox" onClick={checkBoxSelect} value={JSON.stringify(data)} /></TableCell>
                                <TableCell>{idx + 1}</TableCell>
                                <TableCell contentEditable={data._id === selectedItemId} onInput={(e) => UpdatedForm(e, "name", data._id)}> {data.name}</TableCell>
                                <TableCell contentEditable={data._id === selectedItemId} onInput={(e) => UpdatedForm(e, "phone", data._id)}> {data.phoneNumber}</TableCell>
                                <TableCell contentEditable={data._id === selectedItemId} onInput={(e) => UpdatedForm(e, "email", data._id)}> {data.email}</TableCell>
                                <TableCell contentEditable={data._id === selectedItemId} onInput={(e) => UpdatedForm(e, "hobbies", data._id)}> {data.hobbies}</TableCell>
                                <TableCell>
                                    {data._id === selectedItemId ?
                                        <Button onClick={(e) => handleUpdatedData(data._id)}>Save</Button> :
                                        <Button onClick={() => handleUpdate(data._id)}>Update</Button>
                                    }
                                    {data._id === selectedItemId ?
                                        <Button onClick={() => setSelectedItemId(null)}>Cancel</Button> :
                                        <Button onClick={() => handleDelete(data._id)} variant="destructive" disabled >Delete</Button>
                                    }
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
            <div className="flex justify-end">
                <Button onClick={sendData}>Send</Button>
            </div>
        </div>
    );
}