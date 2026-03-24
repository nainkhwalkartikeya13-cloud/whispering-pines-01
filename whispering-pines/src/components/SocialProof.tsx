
import './SocialProof.css';

const SocialProof = () => {
    return (
        <section className="social-proof-section section">
            <div className="container">
                <p className="social-proof-label">Trusted by Travelers Worldwide</p>
                <div className="badges-container">
                    <div className="badge">
                        <span className="badge-text">Skamania County<br />Chamber of Commerce</span>
                        <div className="badge-line"></div>
                    </div>
                    <div className="badge">
                        <span className="badge-text">American Glamping<br />Association Member</span>
                        <div className="badge-line"></div>
                    </div>
                    <div className="badge">
                        <span className="badge-text">Certified<br />Carbon Neutral Resort</span>
                        <div className="badge-line"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SocialProof;
