@component('mail::message')
# ¡Has sido invitado al equipo {{ $invitation->team->name }}!

{{ $invitation->team->owner->name }} te ha invitado a unirte al equipo **{{ $invitation->team->name }}** como **{{ $invitation->role }}**.

@component('mail::button', ['url' => $acceptUrl])
Aceptar Invitación
@endcomponent

Este enlace expirará el {{ $invitation->expires_at->format('d/m/Y H:i') }}.

@component('mail::subcopy')
Si tienes problemas con el botón, copia esta URL en tu navegador:
{{ $acceptUrl }}
@endcomponent
@endcomponent