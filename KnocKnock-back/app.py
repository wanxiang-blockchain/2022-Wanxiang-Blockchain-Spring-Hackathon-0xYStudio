from flask import request, url_for
from flask_api import FlaskAPI, status, exceptions
from flask_restful import Resource, Api
from utils.utils import *

app = FlaskAPI(__name__)


class Quotes(Resource):
    def get(self):
        user_id = "0x17Be2881d37f878520E46082fF3d0AF739aE392B"
        oracle = Oracle_Demo(user_id)
        nc = oracle.get_nft_collections()
        aht = oracle.get_avg_hold_time()
        avg = oracle.get_avg_profit()
        pt = oracle.get_user_patterns()

        return {
            'User_id': user_id,
            'NFT_Collections': nc,
            'AVG_Hold_Time': aht,
            'AVG_Profit': avg,
            'Impression': pt
        }


api.add_resource(Quotes, '/')


notes = {
    0: 'Contract Info',
    1: 'User Impression',
    2: 'User Credential',
}

def note_repr(key):
    return {
        'url': request.host_url.rstrip('/') + url_for('notes_detail', key=key),
        'text': notes[key]
    }


@app.route("/", methods=['GET', 'POST'])
def notes_list():
    """
    List or create notes.
    """
    if request.method == 'POST':
        note = str(request.data.get('text', ''))
        idx = max(notes.keys()) + 1
        notes[idx] = note
        return note_repr(idx), status.HTTP_201_CREATED

    # request.method == 'GET'
    return [note_repr(idx) for idx in sorted(notes.keys())]


@app.route("/<int:key>/", methods=['GET', 'PUT', 'DELETE'])
def notes_detail(key):
    """
    Retrieve, update or delete note instances.
    """
    if request.method == 'PUT':
        note = str(request.data.get('text', ''))
        notes[key] = note
        return note_repr(key)

    elif request.method == 'DELETE':
        notes.pop(key, None)
        return '', status.HTTP_204_NO_CONTENT

    # request.method == 'GET'
    if key not in notes:
        raise exceptions.NotFound()
    return note_repr(key)



if __name__ == "__main__":
    app.run(debug=True)