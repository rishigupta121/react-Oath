import React from "react";

class ProductComment extends React.Component {

    render() {
        return (
            <textarea placeholder="Add your comment." rows="4" className="w-100 border-dark pl-2 mt-2" name="comment"
                      value={this.props.comment}
                      onChange={this.props.handleChange}/>
        );
    }
}

export default ProductComment;