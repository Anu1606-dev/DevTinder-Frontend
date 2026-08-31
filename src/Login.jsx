const Login = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-base-100">
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-96 border p-6 gap-2">
        <legend className="fieldset-legend text-xl font-bold px-2">Login</legend>

        <label className="label">Email</label>
        <input type="email" className="input w-full" placeholder="Email" />

        <label className="label">Password</label>
        <input type="password" className="input w-full" placeholder="Password" />

        <button className="btn btn-neutral w-full mt-4">Login</button>
      </fieldset>
    </div>
  )
}

export default Login;