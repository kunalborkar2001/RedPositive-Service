import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input } from "@nextui-org/react";
import axios from "axios";


export default function AddNew() {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [addData, setAddData] = useState({
        name: "",
        phoneNumber: "",
        email: "",
        hobbies: ""
    });
    // console.log(addData);

    const onChange = (e) => {
        const { name, value } = e.target;
        setAddData(prevData => ({
            ...prevData,
            [name]: value
        }));
    }

    

    const handleSubmit = (e) => {
        e.preventDefault();
        if (addData.name.length > 0) {

            axios.post('https://aggressive-tick-sarong.cyclic.app/api/data', addData)
                .then(response => {
                    console.log('Response:', response.data);
                })
                .catch(error => {
                    console.error('Error:', error.response.data);
                });
        }
        // Api Post request call here
        onClose();
    }

    return (
        <>
            <Button onClick={onOpen} color="primary">Add New Data</Button>
            <Modal isOpen={isOpen} onClose={onClose} placement="top-center">
                <ModalContent>
                    <form onSubmit={handleSubmit}>
                        <ModalHeader className="flex flex-col gap-1">Add New Data</ModalHeader>
                        <ModalBody>
                            <Input
                                autoFocus
                                label="Name"
                                name="name"
                                placeholder="Enter your Name..."
                                variant="bordered"
                                value={addData.name}
                                onChange={onChange}
                                required
                            />
                            <Input
                                label="Phone"
                                name="phoneNumber"
                                placeholder="Phone Number..."
                                variant="bordered"
                                value={addData.phone}
                                onChange={onChange}
                                required
                            />
                            <Input
                                label="Email"
                                name="email"
                                type="email"
                                placeholder="Enter your Email..."
                                variant="bordered"
                                value={addData.email}
                                onChange={onChange}
                                required
                            />
                            <Input
                                label="Hobbies"
                                name="hobbies"
                                placeholder="Enter your Hobbies..."
                                variant="bordered"
                                value={addData.hobbies}
                                onChange={onChange}
                                required
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="flat" onClick={onClose}>
                                Close
                            </Button>
                            <Button color="primary" type="submit">
                                Add
                            </Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>
        </>
    );
}
