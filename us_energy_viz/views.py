from django.shortcuts import render

# Create your views here.


def index(request):
    return render(request, 'us_energy_viz/index.html')
		
	
def about(request):
    return render(request, 'us_energy_viz/about.html')
	
	
def license(request):
    return render(request, 'us_energy_viz/license.html')
	

def charts(request):
    return render(request, 'us_energy_viz/stackedcharts.html')


def contact(request):
    return render(request, 'us_energy_viz/contact.html')