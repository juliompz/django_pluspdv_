from django.urls import path, include

from blog import views

urlpatterns = [
    
    path('', views.TelaAcesso, name='tela-acesso-dashboard'),
    path('caixa/', views.TelaHome, name='tela-home'),
    path('detalhamento-caixa/', views.TelaDetalhamento, name='tela-detalhamento'),
]