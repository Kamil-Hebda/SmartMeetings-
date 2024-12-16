from flask import Flask, jsonify


def init_app(app):

    @app.route('/get_video', methods=['POST'])
    def get_video():
        # Logic to retrieve video from the server based on client request
        return jsonify({"message": "Video retrieved successfully", "video_url": "path_to_video_file"})

    @app.route('/generate_raport', methods=['POST'])
    def get_raport():
        # Logic to generate raport
        return jsonify({"message": "Raport generated successfully", "raport_url": "path_to_raport_file"})
