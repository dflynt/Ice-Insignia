from flask import Blueprint

main = Blueprint('main', __name__)

from . import chatlobby, iceinsignia