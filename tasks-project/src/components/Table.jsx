import React, { useState } from "react";
import { FaCheck, FaEdit, FaTrash } from "react-icons/fa";

const Table = ({ tasks, users, userPerms, handleEdit, setTaskToDelete, setShowConfirmModal }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const filteredTasks = tasks.filter((task) => {
        const assignedUser = users.find((u) => u.id === task.assigned_to)?.username || "";
        const statusText = task.completed ? "completed" : "pending";

        return (
            task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            assignedUser.toLowerCase().includes(searchTerm.toLowerCase()) ||
            statusText.includes(searchTerm.toLowerCase())
        );
    });

    const indexOfLastTask = currentPage * rowsPerPage;
    const indexOfFirstTask = indexOfLastTask - rowsPerPage;
    const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
    const totalPages = Math.ceil(filteredTasks.length / rowsPerPage);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <input
                    type="text"
                    className="form-control w-25"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                />

                <div>
                    <label className="me-2 fw-bold">Rows per page:</label>
                    <select
                        className="form-select d-inline-block w-auto"
                        value={rowsPerPage}
                        onChange={(e) => {
                            setRowsPerPage(parseInt(e.target.value));
                            setCurrentPage(1);
                        }}
                    >
                        {[5, 10, 20, 50].map((num) => (
                            <option key={num} value={num}>
                                {num}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <table className="table table-bordered table-striped table-hover">
                <thead className="table-light">
                    <tr>
                        <th className="text-center">Title</th>
                        <th className="text-center">Description</th>
                        <th className="text-center">Assigned To</th>
                        <th className="text-center">Status</th>
                        <th className="text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentTasks.length > 0 ? (
                        currentTasks.map((task) => (
                            <tr key={task.id}>
                                <td>{task.title}</td>
                                <td>{task.description}</td>
                                <td>{users.find((u) => u.id === task.assigned_to)?.username || "Unknown"}</td>
                                <td className="text-center">
                                    {task.completed ? <><FaCheck className="text-success" /> <span className="ms-2"> Completed</span> </> : "Pending"}
                                </td>
                                <td className="text-center">
                                    {userPerms.change_task || userPerms.delete_task ? (
                                        <>
                                            {userPerms.change_task && (
                                                <button
                                                    className="btn btn-sm btn-outline-primary me-2"
                                                    onClick={() => handleEdit(task)}
                                                >
                                                    <FaEdit /> Edit
                                                </button>
                                            )}
                                            {userPerms.delete_task && (
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => {
                                                        setTaskToDelete(task.id);
                                                        setShowConfirmModal(true);
                                                    }}
                                                >
                                                    <FaTrash /> Delete
                                                </button>
                                            )}
                                        </>
                                    ) : (
                                        <span>No Permissions</span>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center">
                                No tasks found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination with Prev/Next */}
            {totalPages > 1 && (
                <div className="d-flex justify-content-center align-items-center gap-2">
                    <button
                        className="btn btn-outline-secondary btn-sm"
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                    >
                        Previous
                    </button>

                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index}
                            className={`btn btn-sm ${currentPage === index + 1 ? "btn-primary" : "btn-outline-primary"}`}
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}

                    <button
                        className="btn btn-outline-secondary btn-sm"
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                    >
                        Next
                    </button>
                </div>
            )}
        </>
    );
};

export default Table;
