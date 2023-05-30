from django.shortcuts import render

def TelaHome(request):
    return render(request, 'TelaHome.html')

def TelaDetalhamento(request):
    return render(request, 'TelaDetalhamento.html')