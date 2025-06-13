import React, { useState} from "react";

function createForm(fields) {
    return function DynamicForm({ onSubmit }) {
        const [formData, setFormData] = useState(
            fields.reduce((acc, field) => ({ ...acc, [field.name]: field.value }), {})
        );

        const handleChange = (e) => {
            const { name, value } = e.target;
            setFormData((prev) => ({ ...prev, [name]: value }));
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            onSubmit(formData);
        };

        return (
            <form onSubmit={handleSubmit}>
                {fields.map((field) => {

                    if (field.type === "text" || field.type === "email") {
                        return <div key={field.id} className="form-group">
                            <label htmlFor={field.name}>{field.label}</label>
                            <input
                                id={field.id}
                                aria-describedby={field.id}
                                className="form-control form-control-sm"
                                type={field.type}
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleChange}
                            />
                            {!!field?.small && <small id={field.id} className="form-text text-muted">{field.small}</small>}
                        </div>
                    }

                    if (field.type === "textarea") {
                        return <div key={field.id} className="form-group">
                            <label htmlFor={field.name}>{field.label}</label>
                            <textarea
                                id={field.id}
                                aria-describedby={field.id}
                                className="form-control form-control-sm"
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleChange}
                            />
                            {!!field?.small && <small id={field.id} className="form-text text-muted">{field.small}</small>}
                        </div>
                    }

                    if (field.type === "select") {
                        return <div key={field.id} className="form-group">
                            <label htmlFor={field.name}>{field.label}</label>
                            <select
                                id={field.id}
                                aria-describedby={field.id}
                                className="form-control form-control-sm"
                                name={field.name}
                                defaultValue={field.value}
                            //    value={formData[field.name]}
                                onChange={handleChange}
                            >
                                {field.options.map(option => { return <option key={option}>
                                        {option}
                                    </option> })}
                            </select>
                            {!!field?.small && <small id={field.id} className="form-text text-muted">{field.small}</small>}
                        </div>
                    }



                })}
                <button className="btn btn-sm btn-primary" type="submit">Submit</button>
            </form>
        );
    };
};

export default createForm