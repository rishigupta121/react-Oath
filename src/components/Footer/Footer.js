'use strict';

class Footer extends React.Component {

    onClick() {
        firebase.auth().signOut().then(function () {
            // Sign-out successful.
            location.reload();
        }).catch(function (error) {
            // An error happened.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode);
            console.log(errorMessage);
        });
    }

    render() {
        return (
            <div className="footer pb-3">
                <hr className="mt-3"/>
                <a href="" onClick={() => this.onClick()} className="text-primary">Sign Out</a> |
                <a href="src/pdf/terms_of_use.pdf" className="text-primary" download> Terms of Use</a> |
                <a href="src/pdf/privacy_policy.pdf" className="text-primary" download> Privacy Policy</a>
            </div>
        );
    }
}

function loadFooter() {
    // ReactDOM.render(
    //     <Footer/>,
    //     document.getElementById('footer')
    // );
}

function closeFooter() {
    ReactDOM.unmountComponentAtNode(document.getElementById('footer'));
}