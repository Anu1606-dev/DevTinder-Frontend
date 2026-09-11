const ContactUs = () => {
    return (
        <div className="max-w-2xl mx-auto px-4 py-12">
            <h2 className="text-2xl font-bold text-primary mb-6">Contact Us</h2>
            <p className="text-base-content/70 mb-8">
                Have a question, found a bug, or just want to say hi? Reach out through any of the channels below.
            </p>

            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 p-4 border border-base-300 rounded-xl">
                    <span className="text-2xl">📧</span>
                    <div>
                        <p className="font-semibold text-base-content">Email</p>
                        <a href="mailto:sarkaranushka614@gmail.com" className="text-primary hover:underline">
                            sarkaranushka614@gmail.com
                        </a>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-4 border border-base-300 rounded-xl">
                    <span className="text-2xl">🐦</span>
                    <div>
                        <p className="font-semibold text-base-content">Twitter</p>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            @yourhandle
                        </a>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-4 border border-base-300 rounded-xl">
                    <span className="text-2xl">💼</span>
                    <div>
                        <p className="font-semibold text-base-content">LinkedIn</p>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            linkedin.com/in/yourprofile
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;