const Login = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-linear-to-br from-slate-950 via-slate-900 to-indigo-950">
      <fieldset className="fieldset bg-slate-800/70 backdrop-blur-md border border-slate-700/60 rounded-box w-96 p-6 shadow-2xl shadow-blue-500/10">
        <legend className="fieldset-legend text-2xl font-bold px-3 text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-cyan-300">
          Login
        </legend>

        <label className="label text-slate-300">Email</label>
        <input
          type="email"
          className="input w-full bg-slate-900/70 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
          placeholder="Email"
        />

        <label className="label text-slate-300 mt-2">Password</label>
        <input
          type="password"
          className="input w-full bg-slate-900/70 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
          placeholder="Password"
        />

        <button className="btn mt-5 w-full border-none text-white bg-linear-to-r from-blue-600 via-blue-500 to-cyan-400 hover:brightness-110 transition shadow-lg shadow-blue-500/40">
          Login
        </button>
      </fieldset>
    </div>
  )
}

export default Login