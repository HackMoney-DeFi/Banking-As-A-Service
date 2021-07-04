import React from 'react'
import PropTypes from 'prop-types'

function LoadingBtn() {
    return (
        <button class="btn btn-primary" type="button" disabled>
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Loading...
      </button>
    )
}

LoadingBtn.propTypes = {

}

export default LoadingBtn
