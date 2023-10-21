import React from 'react'
import { PdfViewer } from './PdfViewer'

export default {
  title: 'Components/PdfViewer',
  component: PdfViewer,
  parameters: {
    docs: {
      description: {
        component:
          'A component that renders a pdf file with pagination, with supports base64 strings, direct paths with https',
      },
    },
  },
}

export const Default = ({ file }) => {
  return <PdfViewer file={file} />
}

Default.args = {
  file: 'data:application/pdf;base64,JVBERi0xLjcNCiW1tbW1DQoxIDAgb2JqDQo8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFIvTGFuZyhpcy1JUykgL1N0cnVjdFRyZWVSb290IDE0IDAgUi9NYXJrSW5mbzw8L01hcmtlZCB0cnVlPj4vTWV0YWRhdGEgNTYgMCBSL1ZpZXdlclByZWZlcmVuY2VzIDU3IDAgUj4+DQplbmRvYmoNCjIgMCBvYmoNCjw8L1R5cGUvUGFnZXMvQ291bnQgMy9LaWRzWyAzIDAgUiA5IDAgUiAxMSAwIFJdID4+DQplbmRvYmoNCjMgMCBvYmoNCjw8L1R5cGUvUGFnZS9QYXJlbnQgMiAwIFIvUmVzb3VyY2VzPDwvRm9udDw8L0YxIDUgMCBSPj4vRXh0R1N0YXRlPDwvR1M3IDcgMCBSL0dTOCA4IDAgUj4+L1Byb2NTZXRbL1BERi9UZXh0L0ltYWdlQi9JbWFnZUMvSW1hZ2VJXSA+Pi9NZWRpYUJveFsgMCAwIDU5NS4zMiA4NDEuOTJdIC9Db250ZW50cyA0IDAgUi9Hcm91cDw8L1R5cGUvR3JvdXAvUy9UcmFuc3BhcmVuY3kvQ1MvRGV2aWNlUkdCPj4vVGFicy9TL1N0cnVjdFBhcmVudHMgMD4+DQplbmRvYmoNCjQgMCBvYmoNCjw8L0ZpbHRlci9GbGF0ZURlY29kZS9MZW5ndGggMTgyMz4+DQpzdHJlYW0NCnictVlLb9s4EL4b8H/gUS5sVg9SD6AosH2ii03RotndQ7EHRqYTLmQ7keRsf/7ODKlHLLnZZOUcHIsiOcNvZr6ZodnLL+zVq5cXbz+9Y/7r1+zNu7fsbj7zuY9/aZoEzGcykzwKWSoCnoWs1PPZny/Ybj57czmfvfwQsEDyLGaXm/kMZ/ssYInP01CwRMY8DNnlFuZ9/Jaw6wq2Ztf0lLqnj/PZd+/yxlSLVeQxUzHFFn+xy1/ns/ew/df5bAJ1gjDlWV8bUoJksxVuHoOyl/l3T/+YXrYQ3A/HhX/31PTyZICCTsjbLoR3i0gX+gwwpwkP5SnRJHaNHxsGWmxMoSfXIIwinganNFgylP6PqW/I127V9WIlPLPDJ1WbPf7fTa5ThFNPonJkBfb+4i1jvaAMXFAGuCbOeJRCWIWCJykTsKOUgDqPYtJk82Jkg3D6qIZoCuPBSX7bl3q7WIVwpFUQeobsXR0WK0leZ0fJ/gR0QZ8lDvteZWr8IiEeVjFN1/XSvsr3uCfZqNJ5vVil8O7QW6vWOMGKM1WO5pTeNVmYROrC1NxO/dxub1/tWm123XxV5ofnxsbXzkZ+zEU4bqMJTeFnQGzHliB0ENAwQUazJoHvqjB3+IreKwcDjBuVH3BWYSoEKky9L7ooNGFS6+oOAaU12s6n8FFXBHutdj1puKe165XBkcyrS1PVZrFKvE6026ZCCWDpvCbplV2g60V6HBUO0xj4JRM9TEV6BkzjLOBSDEClYzrPq5iu2XYRA6IaPVw4J1RsAwAQshoSGTpbzupDeUtQwSpyS13VqsIRjjz4y9Ao97pguPZvK6zeowGYLrTB7RE1F0jLEzjBf3mCHybEKYm4P6SB2zamylqhSaWny33VeWGl14jY0r67J0RuKDxNTgcuVOdMqqK6gKBE34wi70LpnPyGcFDV9HksEpBFklMHdNrtLN+gpSIfHMOOrltTmnaATmYdp4s5tCYeaqN3BMcJS9pkfm5LSsgn4w7/gBwBFxcGOT2Fzs654fZcOOGztWHR8Eu7aLCVzQ3A2LfE/pAnW1D58Wbu2XpLgcC5kZZxCmAvGouBx65bMxSK/wTeMOgFSpjxWJwD3ijm0ZBQ0I/1wkECbnyP7uzOlu+JGjHhEeUITHaigcdg7ECuzBmut94GYZJ1YJAbsp0tqgs+fYQkNkLGT/ZYTRO5kqSxgh/xYJzVB0vF5NVMDIl66Pzva6O2gHKaOZ8jsnGUU5OnwascjdX59UNzrVJb+CjKbiWtyYAMD44K06QXAfjflilp7P1h7l0yaLzYyRvGEW7iytga1FrIY/CfUbrIFOhAnJt0ZJqO1cNNruA2PfxOzCA9SwAPUoLjUTSBTauOgi3eHQO4amMkL1mCgAolN/osaSTlcXLyoNfkUbXjsi4x9tS1Ze6BzusA+bSrdbk+9OpYQKfZZYzjZAwxKvvWTM9BchLEpdFovzkokiAlZqG3UVtEHb7HSGXwJYUpFGG1pkd51ES4Eh3Gabg0TW9BsQXdp+vlaFNoM9UhN1co2MYQd+P9pEJCXKFLsAoH6yiUAurP7OyBATlfDBmpUNZ5tfVzH3hDYzPUdvS65E2R5afeByy57blzigA/szFRqntDfkZB4CdQgRwsgajarbVp5go/bxyeOGybtBBbLtuhNa6LfVu/itVEZKEfe+86ssKaYRRUSLvyBP1PCGoEOSYYgLopF80FAIFjrFeEmStF9B1C2tFIBqWcrejcU7+0zVLw4/ywrWxLtKSq3Y43we5WkSuPhAW+o1KXWlB4dHW+rWdc9ic2MFvI/NxKGEU1CHggz+6qgeDxMOh/3j1aN96pEg/qxgq9bxzNVdZNjB63OFNcEsUwlJxSvnNj4zpSe1Nx1csf9s1Itd/Pxa4xcJZ39H2xL6968x/Us2N2FFnIk7NTjshiHg4p57g8Qb4EmzoQ9iURagKFrG3j9U5V3TVKl83goUA2UnQ3A42wzQBt87Bs72Momdf2+32Ld2HvM4jkVN27uaFrBdsswNA33UYmih+5UfoJzIng0dlJSCSQP4YkdMSd6Ddh2mbCpUMRx45qBho62LuF7X7t+AZHezcKzfF58xrqhc+quajDyTddgbu2KaZcoLkR3Z4yAC3lZXwm45ha6Z4mXeNh9idTqJASL0PP7c8y42IY2g/qvWXbUPUKatd39YtH/YOVh7o8bN0VhKAS7Nr6a9eVQXpT1p8PrPM4V3hMTmEiTLnMTp3zf7QAg4ZLTt5wCUj4yfDS8rGmMZ5eER9WPIreQJFkckUiYB//6Yik0ysiYvwB56mKZNMrghQ8ZMpHfyyZ/idMKMm4HKbGRzUJptckDnn8DEym/wEojARPnoFJNL0mfjzy+8ejikx/ixQk2dhd8aOaTE+v7vffJ2syPb8GYQQ5/+maTE+wsE6K/3ZP+S/UV9v1DQplbmRzdHJlYW0NCmVuZG9iag0KNSAwIG9iag0KPDwvVHlwZS9Gb250L1N1YnR5cGUvVHJ1ZVR5cGUvTmFtZS9GMS9CYXNlRm9udC9UaW1lc05ld1JvbWFuUFNNVC9FbmNvZGluZy9XaW5BbnNpRW5jb2RpbmcvRm9udERlc2NyaXB0b3IgNiAwIFIvRmlyc3RDaGFyIDMyL0xhc3RDaGFyIDEyMC9XaWR0aHMgNTUgMCBSPj4NCmVuZG9iag0KNiAwIG9iag0KPDwvVHlwZS9Gb250RGVzY3JpcHRvci9Gb250TmFtZS9UaW1lc05ld1JvbWFuUFNNVC9GbGFncyAzMi9JdGFsaWNBbmdsZSAwL0FzY2VudCA4OTEvRGVzY2VudCAtMjE2L0NhcEhlaWdodCA2OTMvQXZnV2lkdGggNDAxL01heFdpZHRoIDI2MTQvRm9udFdlaWdodCA0MDAvWEhlaWdodCAyNTAvTGVhZGluZyA0Mi9TdGVtViA0MC9Gb250QkJveFsgLTU2OCAtMjE2IDIwNDYgNjkzXSA+Pg0KZW5kb2JqDQo3IDAgb2JqDQo8PC9UeXBlL0V4dEdTdGF0ZS9CTS9Ob3JtYWwvY2EgMT4+DQplbmRvYmoNCjggMCBvYmoNCjw8L1R5cGUvRXh0R1N0YXRlL0JNL05vcm1hbC9DQSAxPj4NCmVuZG9iag0KOSAwIG9iag0KPDwvVHlwZS9QYWdlL1BhcmVudCAyIDAgUi9SZXNvdXJjZXM8PC9FeHRHU3RhdGU8PC9HUzcgNyAwIFIvR1M4IDggMCBSPj4vRm9udDw8L0YxIDUgMCBSPj4vUHJvY1NldFsvUERGL1RleHQvSW1hZ2VCL0ltYWdlQy9JbWFnZUldID4+L01lZGlhQm94WyAwIDAgNTk1LjMyIDg0MS45Ml0gL0NvbnRlbnRzIDEwIDAgUi9Hcm91cDw8L1R5cGUvR3JvdXAvUy9UcmFuc3BhcmVuY3kvQ1MvRGV2aWNlUkdCPj4vVGFicy9TL1N0cnVjdFBhcmVudHMgMT4+DQplbmRvYmoNCjEwIDAgb2JqDQo8PC9GaWx0ZXIvRmxhdGVEZWNvZGUvTGVuZ3RoIDE1MTQ+Pg0Kc3RyZWFtDQp4nO1a227bRhB9F6B/4CMV2OO9X4AgD3EuSAEHCeK2D0UfGJpWCOgSk1TQz+/O7kqivSZStKKRSLUBSVxyd2fOzJzZAym7+JA9f35xdfnuVUZevMhevrrMLt5+0tm8nU5oNp9OlAVuRKYlA8UyIRVImVEDkoisqaaT22fTSfb66jLLekvRuNTddEKA4J8xmmYkk1YCZ5kRFCzz839/lq2mk5fX08nFG5pRCVZl17e4OXH/NNMEDMP9FTCWXS/dimiWM9J4I0n2djr5I3/d1cUym50bm3+bnfO8Ws3OWXwturoNt8rZucrXeH+FL21VdlW3mZ2LvMEHZL6cibzY4KTGz7Eyr/wl3tZ56z7LvC3rr/hed4DDKv+t9nsWS3zd+JXDfn6X/X5xkWKOO9adM2sm3eCf2fUv08lrB8HH6eQfQ/ZxHxsugKlebLjaheaAEeAatNhHIAJfNesWAUIomMx/7dw7l3mBbyLg2bYeHXxA5xWGYO5D1IWRgPd8h10Vhr/usGu6Iizuby+6pi7rqv23uA07yoUBpQcdnfuM6tD+YGFb3WAge+Z6A5uN9zcC8m7VVc3NBmchGAGd7Sr3PNhGEw0bPZgUN0t89OFaVK0vieLGF4+zmFqW3xZLxNx9VnlR4gfjHvH11VX+0hWEByEUyTImPI774aYOwy7z/TquEuptVVDL3Qabsv6MG4cKgjj+PkR9UWw38ZMiqCKC+hiQymoQfcoSZgwkCQXCEiQXRUjdKmQ5cazhMt94cz0cVQORVxgx+ZvZuY5+lz7/iQ0V0RTfap9lvgSIzm+rTaCPootzPR6IHM+/RDxxuK39A5QgL4le4lJXnYv6bl9vnsYYUfmrPVVV5QCo2gIZnWuUYSDTErxtMHu8fR6cOmQFszQafYeQ7knEkhzBcxDEqy1Z+Uvj8rjcLNvCzz3D7Izj21KPs3wqP1IWeK9AVJty4y9ZfuPNmu9grAP31cuZI4Sww6OoKgJ6dFCVAJrW/IdqsahiTbV3aGOfhUMWr4oG/Yxji2q9zTMd3NyW6NnhSZkpN6SHjN9nsScVZvOFt+1zr3mEOzrEJjwb+bvXiJGXyS7wkbuv1s3n3vPhYLEYpm4lGB5SRmYcJaR7T6B4eDZBunQxjSCsG8+nOr8q0OeqrFZFu2Vf1mtl7mKBZFSUtSf3OjSACGZZn822j/lO3oXP33Z4LzzCnee4It4NpYCrtgsIQ5+qXWHi9sFcGcqpT1ePwsw4mPE5iGngKQc9oE7MG2Z2jfAsoohjDw4Mfsgfdep2ub6JdIOj+/V27sP2tjssvMdzJds+/GV/ur0JHaaZYbgR3Z4xDlrflvHaB6fuiqpniY9VYKv1cAclEuToOBMDNq3se2c9xysiOUyX6xWi3T84Vn9lzaZrNkv0FHASHr/mIV2b3SKuuRUhnZG3twkXjx0HZzDBnFqyQ37+h+N/IrvYwWWXdO2e0+8ZnRjCoyExj6TQYAfOtMlccXgnJAWhEydOWTJKZkHSsTuV5Bxomj3HJxmHHH0iySgpBTo6UUsqQPHj1ozCMtCjq29hFbCUkI5VMwotsImMTDZCuyaT1uDRakYhHRKjF72QFkRa9D+HaBww/scSjYJrPB6OHUc3g6SUczqiUVCLLXpsEmKuf6QkdEqiURACmvfz2YgxkCYCWFrbRycbB/w8pGyUB1dc3HV8mbLN92Sjui8bueDABjpcMlcf3gmhMJH/l4372uZMgNZjk6ijGuBp9hyfbBxy9IlkIycKBB375MGJBWOPWzYyY4CMfhZ3mgVkSkjHKhuZe5ejkw3THGhag0crG5mkwEYveiYFqLTofw7ZOGD8jyUbGWdgxqccroCnlHM6spFRAUKNrmYY1WBP+8tG6rCzZmy6p9Y1lRP4tnHAz0PKRnNwxUVdKjzyy4bvyUZ7XzZSboa+tU5/qEoO7wTOSJE/ZdlIGQEqxu5VlHH8ifLxy8YhR59INlJCQanRiZpI/FHzUctGw4GT0evCKNAmPVscnWz05P43Oz5ztg0KZW5kc3RyZWFtDQplbmRvYmoNCjExIDAgb2JqDQo8PC9UeXBlL1BhZ2UvUGFyZW50IDIgMCBSL1Jlc291cmNlczw8L0V4dEdTdGF0ZTw8L0dTNyA3IDAgUi9HUzggOCAwIFI+Pi9Gb250PDwvRjEgNSAwIFI+Pi9Qcm9jU2V0Wy9QREYvVGV4dC9JbWFnZUIvSW1hZ2VDL0ltYWdlSV0gPj4vTWVkaWFCb3hbIDAgMCA1OTUuMzIgODQxLjkyXSAvQ29udGVudHMgMTIgMCBSL0dyb3VwPDwvVHlwZS9Hcm91cC9TL1RyYW5zcGFyZW5jeS9DUy9EZXZpY2VSR0I+Pi9UYWJzL1MvU3RydWN0UGFyZW50cyAyPj4NCmVuZG9iag0KMTIgMCBvYmoNCjw8L0ZpbHRlci9GbGF0ZURlY29kZS9MZW5ndGggMTI1OT4+DQpzdHJlYW0NCnic5Vfdb9s2EH834P+Bj3SRMBK/RAFFH5qkRQekaNFsexj2wMiMK0CyE0kO9uePd6RkN7JXZJCBrW0BRzx+3f3u7ndHcvGJvH59cXP54Yokb96Qt1eX5OL9l4ys2vksJav5TOdMGEkyxZnmRCrNlCKpYSqRpHHz2f2r+Yxc31wSsndUGo96nM8SlsA/Y7KUJETliglOjExZznH/76/Iej57ezufXbxLSapYrsntPVye+P8pyRJmONyvGefktvYnglpeSYNKJuT9fPYHvW8WkpbrxbmgK/gpq8qSxTnPU4pC9+gHdIufKE9ouVycpwmNI9dsWliCQ0NtUWzr1uLes8W56uVuBYtcF3fVMG8r1/qTJbVLmLRxzi7ONW2KLQ45XaJaqByeWrYt/qkXgrJww5/k9pf57Npj8XkHvJCM6z3ghR5wnxBekbFM7uCNqH5yVeVQ2861j6DkDsGMbuC7WdsGDI2yyqE0DHAn7vDeOHtm3wTKc+1F2THlH4fbyxZ9QCvU7Q5+gu5dmMmCc8LaIGjtCjxadmGJSAbPM1ig6M2mudtb/4S4VIDEET+C+id3YwqXjZCA6FS0LcoH+FtC8KbepRGDTQMmpRm9sWCyK9zattGJKaetW4I4DLyBmc8NSDROS4j0NI9YFuXZol/mAIcufD8NcFcIcPeAORNnQyrAqW3FguiLGxITrg/qqpBOtb/CdcdR1nnG5D5NSXMKmJOUJXwEs63KXcwhRQjumQSx6txZRBFkfSwFQ4Joi5C29WYZ6Qaku/MG81k/LRT9aOvIWbD4K96L12E8N65ZgLsB3T1lPLSdi2N0TtlZt6cJ+iqw1QY9ehDoLGfJyWlJG87UOLMDpXRNWZSu9bwiQxhtBm4lxWYNcK927iDuL9Jsu2Zbg6kMNn1Yd+AIiNdmOMQVxIZ4BuLuIw7PaNnkDCa5r6T5MTv/LWN+PlCS+eQlWfuWIP+eziM9xPR6cAWh+FJFZFQkBrTKBRSRgwE92qsmN0J54uJjSrnuSlv7ODR5rDCY3eHXhtLkpwoI1F30t67oMGQlbWCBwiC2SDAN7slV5BuYzkb1AYjYaPpbiXfaesiieN/zbAuH7FXMxaibeUns9h7JFOPiSMs5IfKZYUaMkO/7wVjuf0U6V9jcCRkADQ2cDQ0AMuhqYH4vCYDvUxCKH/baDxsO/4bPpm+ThDRMZ0cN/bYWQe8zVPxeXVSw2aK9ERAgz2a57SkyoPNPpVl5P5rs1BVD6YQJNTIS/TVu01Pfl9/bGkD339p3NvBh5FC0cehTAlEIaVL3rZGXo7gpg1iGPjP1uVD2eZHmwl+wLco7uDhWkSj/2HfG/SWx0UZUZUT1IJLC50J6ciRhx5jfKxti14UwTzxv+NA3qC7C4RrWv6MSQ99B8xHsLjABkjykRGOfSgwzzIEko/duGwjEdnFv6A2xy/7aPyq8OHSE3Lcxdr8d9BL1vAXDWE00vdqRla/vh0HlHjdx6s5RccH0OAd/2Ner8p2yPn3SJ4ql46T/f7xejyj/33q9SiOYODnlSKNZNqacn+f5KrWEEn1iEpLaHzwmoZ/p+SqlZvLkvCRlzvJxav9wz9cjdk75fNWTv7ikL/ie0l76bMwmV0TknMnvojdSxEyviGcf/XJE8ukVEb4OZC9WJE2m1yQxLB9T5SFN/gZ7xlU0DQplbmRzdHJlYW0NCmVuZG9iag0KMTMgMCBvYmoNCjw8L0F1dGhvcij+/wBKAPMAbgAgAEIAagBhAHIAbgBpACAA0wBsAGEAZgBzAHMAbwBuKSAvQ3JlYXRvcij+/wBNAGkAYwByAG8AcwBvAGYAdACuACAAVwBvAHIAZAAgAGYAbwByACAATQBpAGMAcgBvAHMAbwBmAHQAIAAzADYANSkgL0NyZWF0aW9uRGF0ZShEOjIwMjExMTMwMTUxMjA5KzAwJzAwJykgL01vZERhdGUoRDoyMDIxMTEzMDE1MTIwOSswMCcwMCcpIC9Qcm9kdWNlcij+/wBNAGkAYwByAG8AcwBvAGYAdACuACAAVwBvAHIAZAAgAGYAbwByACAATQBpAGMAcgBvAHMAbwBmAHQAIAAzADYANSkgPj4NCmVuZG9iag0KMjEgMCBvYmoNCjw8L1R5cGUvT2JqU3RtL04gNDAvRmlyc3QgMjk3L0ZpbHRlci9GbGF0ZURlY29kZS9MZW5ndGggNjY1Pj4NCnN0cmVhbQ0KeJy1lm9r2zAQxt8X+h3uG8iSTrIEpTDWlo3SEJLAXpS8cBMtCU3s4jjQfvudfEnrbmFMgkHw6c/9Hknnx7GlhwKUAiNBaZAFgkKQpgRlQBUOlKWWB1WClpToQFvK9IBSgS4ALdIE0RY0iVia12BVARrBlpRioCRBbaEsKaUEFyU8OCcBC/AEoQTvDKCi1SkP4y4cLUDbkJSChqJHwBKkQgf0k7qgcU/R0JoFUJqNB5BoHNCQNLRVQzrG0jzpWEkX4qwlEWp6TZ14PjoI7VwpS4vQkTXp0N6VVhIoRSGJYSwAnebqSoyjSAETMRVjMXt7CWLatYdFd7sNO3H/CMUcxHgFOuZcX19e/ANCtUyHNGA6ZNIRm46U6YhLR3xGoXNujsxgMu6n1BlMhgVkhgdkhglkhgvoKWbIJ0AqHXl/dlIgk47Y06OQArl0xL87O4V6r7aU6eVOYnQGg6eCJ1E2gykzGJfB+AzmdF9/h/AI3TSLwy7U3Vm2N0N8r/dBc0AOhoPlUHJwHJijF3sfJAdW0ayiWUWzimYVzSqacWQcGUfGkXFkHBlH5pBXR8YN44Zxw7hh3PT4HI7lGBx91oYwaZpOTJpteKhe4gs+FmpctVSkOBtf9XEk1sexzGB2FF67+/AG+ih9R1p10wUxipfbevnRmVHqU/MqpmHRiW+hWoaW25E5tb/X200dpusq7jAOfKlJoeo2TX3st93mZ0WNvvejaZ+fmub547bGkf06hC5ushMP1aJtBv2va7oO+jebatusBgPT7WYZBrm8DqWt2mon7jarQxuOZx0ddvv4p6C48v3HT2+H+PUzrPeo2oX9I3f/cNlns/1vz80hbuFkvLP+O2vDs27ED8WTM/9i0ASfXl78AvlH2KENCmVuZHN0cmVhbQ0KZW5kb2JqDQo1NSAwIG9iag0KWyAyNTAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDI1MCAwIDI1MCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCA3MjIgMCAwIDcyMiA2MTEgNTU2IDAgMCAzMzMgMCAwIDYxMSA4ODkgNzIyIDAgNTU2IDAgMCA1NTYgNjExIDcyMiA3MjIgMCAwIDAgMCAwIDAgMCAwIDAgMCA0NDQgNTAwIDQ0NCA1MDAgNDQ0IDMzMyA1MDAgNTAwIDI3OCAyNzggMCAyNzggNzc4IDUwMCA1MDAgNTAwIDUwMCAzMzMgMzg5IDI3OCA1MDAgNTAwIDcyMiA1MDBdIA0KZW5kb2JqDQo1NiAwIG9iag0KPDwvVHlwZS9NZXRhZGF0YS9TdWJ0eXBlL1hNTC9MZW5ndGggMzA5Nz4+DQpzdHJlYW0NCjw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+PHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iMy4xLTcwMSI+CjxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CjxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiICB4bWxuczpwZGY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGRmLzEuMy8iPgo8cGRmOlByb2R1Y2VyPk1pY3Jvc29mdMKuIFdvcmQgZm9yIE1pY3Jvc29mdCAzNjU8L3BkZjpQcm9kdWNlcj48L3JkZjpEZXNjcmlwdGlvbj4KPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyI+CjxkYzpjcmVhdG9yPjxyZGY6U2VxPjxyZGY6bGk+SsOzbiBCamFybmkgw5NsYWZzc29uPC9yZGY6bGk+PC9yZGY6U2VxPjwvZGM6Y3JlYXRvcj48L3JkZjpEZXNjcmlwdGlvbj4KPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+Cjx4bXA6Q3JlYXRvclRvb2w+TWljcm9zb2Z0wq4gV29yZCBmb3IgTWljcm9zb2Z0IDM2NTwveG1wOkNyZWF0b3JUb29sPjx4bXA6Q3JlYXRlRGF0ZT4yMDIxLTExLTMwVDE1OjEyOjA5KzAwOjAwPC94bXA6Q3JlYXRlRGF0ZT48eG1wOk1vZGlmeURhdGU+MjAyMS0xMS0zMFQxNToxMjowOSswMDowMDwveG1wOk1vZGlmeURhdGU+PC9yZGY6RGVzY3JpcHRpb24+CjxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyI+Cjx4bXBNTTpEb2N1bWVudElEPnV1aWQ6OTgyNUM0RjctMEUwOC00NDBELTgzRUItODk5NTQyRUEyNkE5PC94bXBNTTpEb2N1bWVudElEPjx4bXBNTTpJbnN0YW5jZUlEPnV1aWQ6OTgyNUM0RjctMEUwOC00NDBELTgzRUItODk5NTQyRUEyNkE5PC94bXBNTTpJbnN0YW5jZUlEPjwvcmRmOkRlc2NyaXB0aW9uPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKPC9yZGY6UkRGPjwveDp4bXBtZXRhPjw/eHBhY2tldCBlbmQ9InciPz4NCmVuZHN0cmVhbQ0KZW5kb2JqDQo1NyAwIG9iag0KPDwvRGlzcGxheURvY1RpdGxlIHRydWU+Pg0KZW5kb2JqDQo1OCAwIG9iag0KPDwvVHlwZS9YUmVmL1NpemUgNTgvV1sgMSA0IDJdIC9Sb290IDEgMCBSL0luZm8gMTMgMCBSL0lEWzxGN0M0MjU5ODA4MEUwRDQ0ODNFQjg5OTU0MkVBMjZBOT48RjdDNDI1OTgwODBFMEQ0NDgzRUI4OTk1NDJFQTI2QTk+XSAvRmlsdGVyL0ZsYXRlRGVjb2RlL0xlbmd0aCAxNTY+Pg0Kc3RyZWFtDQp4nDXQSQ6CUAyA4YIjgyggiigoOCVu3HofvYFXMiYewTO5casbfPbXLvqlSdukFTFR15bJociXKzwU66U4R8UN4K14ezgp/lmJbkp8V9KniG2WJVJCBUtYwQJ+nWszl1X/ygIbGtCEFrShA11wwAUPfOhBAH0YwAZCiCCGISQwgjFsIYUJZDCFGeRQwNxcm5f6rOKg7C4iHziIEi0NCmVuZHN0cmVhbQ0KZW5kb2JqDQp4cmVmDQowIDU5DQowMDAwMDAwMDE0IDY1NTM1IGYNCjAwMDAwMDAwMTcgMDAwMDAgbg0KMDAwMDAwMDE2NiAwMDAwMCBuDQowMDAwMDAwMjM1IDAwMDAwIG4NCjAwMDAwMDA1MDUgMDAwMDAgbg0KMDAwMDAwMjQwMyAwMDAwMCBuDQowMDAwMDAyNTc0IDAwMDAwIG4NCjAwMDAwMDI4MTAgMDAwMDAgbg0KMDAwMDAwMjg2MyAwMDAwMCBuDQowMDAwMDAyOTE2IDAwMDAwIG4NCjAwMDAwMDMxODcgMDAwMDAgbg0KMDAwMDAwNDc3NyAwMDAwMCBuDQowMDAwMDA1MDQ5IDAwMDAwIG4NCjAwMDAwMDYzODQgMDAwMDAgbg0KMDAwMDAwMDAxNSA2NTUzNSBmDQowMDAwMDAwMDE2IDY1NTM1IGYNCjAwMDAwMDAwMTcgNjU1MzUgZg0KMDAwMDAwMDAxOCA2NTUzNSBmDQowMDAwMDAwMDE5IDY1NTM1IGYNCjAwMDAwMDAwMjAgNjU1MzUgZg0KMDAwMDAwMDAyMSA2NTUzNSBmDQowMDAwMDAwMDIyIDY1NTM1IGYNCjAwMDAwMDAwMjMgNjU1MzUgZg0KMDAwMDAwMDAyNCA2NTUzNSBmDQowMDAwMDAwMDI1IDY1NTM1IGYNCjAwMDAwMDAwMjYgNjU1MzUgZg0KMDAwMDAwMDAyNyA2NTUzNSBmDQowMDAwMDAwMDI4IDY1NTM1IGYNCjAwMDAwMDAwMjkgNjU1MzUgZg0KMDAwMDAwMDAzMCA2NTUzNSBmDQowMDAwMDAwMDMxIDY1NTM1IGYNCjAwMDAwMDAwMzIgNjU1MzUgZg0KMDAwMDAwMDAzMyA2NTUzNSBmDQowMDAwMDAwMDM0IDY1NTM1IGYNCjAwMDAwMDAwMzUgNjU1MzUgZg0KMDAwMDAwMDAzNiA2NTUzNSBmDQowMDAwMDAwMDM3IDY1NTM1IGYNCjAwMDAwMDAwMzggNjU1MzUgZg0KMDAwMDAwMDAzOSA2NTUzNSBmDQowMDAwMDAwMDQwIDY1NTM1IGYNCjAwMDAwMDAwNDEgNjU1MzUgZg0KMDAwMDAwMDA0MiA2NTUzNSBmDQowMDAwMDAwMDQzIDY1NTM1IGYNCjAwMDAwMDAwNDQgNjU1MzUgZg0KMDAwMDAwMDA0NSA2NTUzNSBmDQowMDAwMDAwMDQ2IDY1NTM1IGYNCjAwMDAwMDAwNDcgNjU1MzUgZg0KMDAwMDAwMDA0OCA2NTUzNSBmDQowMDAwMDAwMDQ5IDY1NTM1IGYNCjAwMDAwMDAwNTAgNjU1MzUgZg0KMDAwMDAwMDA1MSA2NTUzNSBmDQowMDAwMDAwMDUyIDY1NTM1IGYNCjAwMDAwMDAwNTMgNjU1MzUgZg0KMDAwMDAwMDA1NCA2NTUzNSBmDQowMDAwMDAwMDAwIDY1NTM1IGYNCjAwMDAwMDc0NTcgMDAwMDAgbg0KMDAwMDAwNzczNiAwMDAwMCBuDQowMDAwMDEwOTE2IDAwMDAwIG4NCjAwMDAwMTA5NjEgMDAwMDAgbg0KdHJhaWxlcg0KPDwvU2l6ZSA1OS9Sb290IDEgMCBSL0luZm8gMTMgMCBSL0lEWzxGN0M0MjU5ODA4MEUwRDQ0ODNFQjg5OTU0MkVBMjZBOT48RjdDNDI1OTgwODBFMEQ0NDgzRUI4OTk1NDJFQTI2QTk+XSA+Pg0Kc3RhcnR4cmVmDQoxMTMxOA0KJSVFT0YNCnhyZWYNCjAgMA0KdHJhaWxlcg0KPDwvU2l6ZSA1OS9Sb290IDEgMCBSL0luZm8gMTMgMCBSL0lEWzxGN0M0MjU5ODA4MEUwRDQ0ODNFQjg5OTU0MkVBMjZBOT48RjdDNDI1OTgwODBFMEQ0NDgzRUI4OTk1NDJFQTI2QTk+XSAvUHJldiAxMTMxOC9YUmVmU3RtIDEwOTYxPj4NCnN0YXJ0eHJlZg0KMTI2NTUNCiUlRU9G',
}
