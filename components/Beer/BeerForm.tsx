"use client";

import { useState } from "react";

export default function BeerForm() {

  const [name, setName] = useState("");
  const [brewer, setBrewer] = useState("");
  const [type, setType] = useState("");
  const [img, setImg] = useState("");
  const [error, setError] = useState([]);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async ( e:React.FormEvent<HTMLFormElement> ) => {
    e.preventDefault();

    const res = await fetch("api/beer", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        name, brewer, type, img
      }),
    });

    const { msg, success } = await res.json();
    console.log( msg );
    setError(msg);
    setSuccess(success);

    if (success) {
      setName('');
      setBrewer('');
      setType('');
      setImg('');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="py-4 mt-4 border-t flex flex-col gap-5" >
        <div>
          <label htmlFor="name">Beer Name</label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            id="name"
            placeholder=".394 San Diego Pale Ale"
          />
        </div>

        <div>
          <label htmlFor="brewer">Brewer</label>
          <input
            onChange={(e) => setBrewer(e.target.value)}
            value={brewer}
            type="text"
            id="brewer"
            placeholder="AleSmith Brewing Company"
          />
        </div>

        <div>
          <label htmlFor="type">Type of Beer</label>
          <input
            onChange={(e) => setType(e.target.value)}
            value={type}
            type="text"
            id="type"
            placeholder="American Pale Ale"
          />
        </div>

        <button className="bg-green-700 p-3 text-white font-bold" type="submit">Send</button>

      </form>

      <div className="bg-slate-100 flex flex-col">
        {error && error.map((e) => (
            <div key={e} className={ `${ success ? "text-green-800" : "text-red-600" } px-5 py-2`} >{e} </div>
        ))}
      </div>
    </>
  );
}