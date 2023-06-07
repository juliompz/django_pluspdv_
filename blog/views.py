from django.shortcuts import render

def TelaHome(request):
    return render(request, 'TelaHome.html')

def TelaDetalhamento(request):
    return render(request, 'TelaDetalhamento.html')

def TelaAcesso(request):
    return render(request, 'acesso/TelaAcesso.html')