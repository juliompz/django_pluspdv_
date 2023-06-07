from django.urls import path, include

from blog import views

urlpatterns = [
    path('', views.TelaHome, name='tela-home'),
    path('detalhamento-caixa/', views.TelaDetalhamento, name='tela-detalhamento'),
    path('acesso/', views.TelaAcesso, name='tela-acesso')
]