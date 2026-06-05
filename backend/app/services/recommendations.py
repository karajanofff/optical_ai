from app.models.device import Device


def _device_type_steps(device: Device) -> list[str]:
    device_type = device.device_type.upper()
    if device_type == "OLT":
        return [
            "OLT PON portlari va upstream uplink holatini tekshiring.",
            "ONT ro'yxatdan o'tish va autentifikatsiya loglarini ko'rib chiqing.",
        ]
    if device_type == "ONU":
        return [
            "Abonent tomondagi optik drop kabel va konnektorlarni tekshiring.",
            "ONU qayta ro'yxatdan o'tkazish (re-register) amalini bajaring.",
        ]
    if device_type == "ODF":
        return [
            "ODF patch panelidagi splice va konnektorlarni inspeksiya qiling.",
            "Fiber yo'nalishidagi attenuatsiya nuqtalarini o'lchang.",
        ]
    if "SWITCH" in device_type:
        return [
            "Optik switch port konfiguratsiyasi va trafik balansini tekshiring.",
            "Port utilization va signal loss ko'rsatkichlarini tahlil qiling.",
        ]
    return ["Qurilma fizik ulanishlari va optik kuchlanishni tekshiring."]


def build_fix_recommendations(device: Device, severity: str) -> list[str]:
    steps: list[str] = []

    if severity == "critical":
        steps.extend(
            [
                "Qurilmani zudlik bilan oflayn deb belgilang va zaxira yo'nalishni faollashtiring.",
                "Quvvat manbai, PSU va asosiy optik kabel uzilishini tekshiring.",
            ]
        )
    else:
        steps.append("Qurilma holatini monitoringda kuzatib boring va metrikalar trendini tahlil qiling.")

    if device.signal_strength <= -26:
        steps.append(
            f"Signal kuchi past ({device.signal_strength} dBm): fiber konnektorlarni tozalang, "
            "patch kabelni almashtiring yoki attenuator sozlamasini tekshiring."
        )
    elif device.signal_strength <= -22:
        steps.append(
            f"Signal kuchi chegarada ({device.signal_strength} dBm): ODF va splitterni tekshiring, "
            "optik kuchlanishni qayta o'lchang."
        )

    if device.latency >= 10:
        steps.append(
            f"Yuqori kechikish ({device.latency} ms): tarmoq congestionsini kamaytiring, "
            "routing va QoS sozlamalarini optimallashtiring."
        )
    elif device.latency >= 6:
        steps.append(
            f"Kechikish oshgan ({device.latency} ms): uplink bandini va parallel trafikni tekshiring."
        )

    if device.packet_loss >= 2.5:
        steps.append(
            f"Paket yo'qotilishi yuqori ({device.packet_loss}%): kabel shikastlanishi, "
            "elektromagnit interferensiya yoki port xatosini tekshiring."
        )
    elif device.packet_loss >= 1.0:
        steps.append(
            f"Paket yo'qotilishi kuzatildi ({device.packet_loss}%): konnektor va patch kabel sifatini tekshiring."
        )

    if device.temperature >= 55:
        steps.append(
            f"Harorat yuqori ({device.temperature} C): sovutish tizimi, ventilyatsiya va "
            "qurilma joylashuvini tekshiring."
        )
    elif device.temperature >= 45:
        steps.append(
            f"Harorat oshgan ({device.temperature} C): rack ventilyatsiyasi va muhit haroratini nazorat qiling."
        )

    steps.extend(_device_type_steps(device))
    steps.append(
        f"Joylashuv: {device.location}. Maydon brigadasiga chiqish yoki masofadan qayta ishga tushirishni rejalashtiring."
    )
    steps.append("Muammo bartaraf etilgandan so'ng «Tuzatildi deb belgilash» tugmasini bosing.")

    return steps[:6]
