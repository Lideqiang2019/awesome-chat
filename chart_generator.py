import matplotlib.pyplot as plt
import json
import base64
from io import BytesIO
import numpy as np
import sys

def generate_chart(chart_data):
    """Generate chart based on the provided data and return base64 encoded image."""
    print("Received chart data:", chart_data, file=sys.stderr)
    plt.figure(figsize=(10, 6))
    
    data = json.loads(chart_data)
    chart_type = data['type']
    labels = data['data']['labels']
    datasets = data['data']['datasets']
    
    if chart_type == 'line':
        for dataset in datasets:
            plt.plot(labels, dataset['data'], label=dataset['label'])
        plt.xlabel('Time')
        plt.ylabel('Value')
        
    elif chart_type == 'bar':
        x = np.arange(len(labels))
        width = 0.35
        for i, dataset in enumerate(datasets):
            plt.bar(x + i*width, dataset['data'], width, label=dataset['label'])
        plt.xlabel('Categories')
        plt.ylabel('Value')
        plt.xticks(x + width/2, labels)
        
    elif chart_type == 'pie':
        plt.pie(datasets[0]['data'], labels=labels, autopct='%1.1f%%')
        
    elif chart_type == 'scatter':
        for dataset in datasets:
            plt.scatter(range(len(dataset['data'])), dataset['data'], label=dataset['label'])
        plt.xlabel('X')
        plt.ylabel('Y')
    
    plt.title(data['title'])
    plt.legend()
    plt.grid(True)
    
    # Save plot to bytes buffer
    buffer = BytesIO()
    plt.savefig(buffer, format='png', bbox_inches='tight')
    buffer.seek(0)
    image_png = buffer.getvalue()
    buffer.close()
    plt.close()
    
    # Encode to base64
    graphic = base64.b64encode(image_png).decode('utf-8')
    print(graphic)  # Print to stdout for the Node.js process to capture
    return graphic

if __name__ == '__main__':
    # Read input from stdin
    chart_data = sys.stdin.read().strip()
    generate_chart(chart_data) 