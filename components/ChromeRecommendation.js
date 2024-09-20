const React = require('react');

class ChromeRecommendation extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isChrome: false,
      isBrowser: false
    };
  }

  componentDidMount() {
    // This will only run on the client (browser)
    this.setState({
      isBrowser: true,
      isChrome: this.isChromeBrowser()
    });
  }

  // Function to check if the user is using Chrome
  isChromeBrowser() {
    const userAgent = navigator.userAgent;
    const isChrome = /Chrome/.test(userAgent) && /Google Inc/.test(navigator.vendor);
    return isChrome;
  }

  render() {
    // Only display the alert in the browser and if the browser is not Chrome
    if (this.state.isBrowser && !this.state.isChrome) {
      return (
        <div style={{
          backgroundColor: '#f9c74f',
          color: '#333',
          padding: '10px',
          textAlign: 'center',
          fontFamily: 'Arial, sans-serif',
          width: '100%',     
          position: 'fixed',       
          top: '0',          
          left: '0',           
          zIndex: '1000',       
          boxSizing: 'border-box' 
        }}>
          For the best experience, we recommend using 
          <a href="https://www.google.com/chrome/" target="_blank"> Google Chrome</a> to view the animations on this site.
        </div>
      );
    }
    // Return null if it's Chrome or not running in the browser
    return null;
  }
}

module.exports = ChromeRecommendation;
