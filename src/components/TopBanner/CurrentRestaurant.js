'use strict';
//TODO remove this??
class CurrentRestaurant extends React.Component {
    render() {
        return (
            <div>
                <h4 className="text-primary pt-1" align="center">
                    <span className="font-weight-bold">{this.props.name} </span>
                </h4>
            </div>
        );
    }
}

function loadCurrentRestaurant(name, id) {
    ReactDOM.render(
        <CurrentRestaurant name={name}/>,
        document.getElementById('banner')
    );
}