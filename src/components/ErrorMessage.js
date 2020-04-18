'use strict';

class ErrorMessage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <p>{this.props.error}</p>
            </div>
        );
    }
}

function loadErrorMessage(errorMessage) {
    ReactDOM.render(
        <ErrorMessage error={errorMessage}/>,
        document.getElementById('main-content')
    );
}