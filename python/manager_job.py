"""
Job managing file for starting the TIM framework
"""
import sys
from tim import framework
from apps.tim_manager import tick
from apps.default_mapping import default_mapping
def main():
    """
    Config file may be changed in this function.
    Dummy function for starting framework.
    """
    configfile = "/home/pi/configfiles/outstation.cfg"
    framework(configfile, tick, default_mapping)

if __name__ == '__main__':
    try:
        import daemonocle
        if len(sys.argv) > 1:
            if sys.argv[1] == "test":
                if len(sys.argv) > 2:
                    print(sys.argv[2])
                    framework(sys.argv[2], tick, default_mapping)
                else:
                    main()
            DEMON_PROGRAM = daemonocle.Daemon(
                worker=main,
                pidfile='/var/run/tim_manager.pid',
            )
            DEMON_PROGRAM.do_action(sys.argv[1])
        else:
            print ("Use one of start, stop, status, restart as command-line argument.")
    except ImportError:
        print ("daemonocle package not found. Use command \n "
               "\tpip install daemonocle \n to install daemonocle")
        # if CheckForProcess(os.path.basename(__file__)):
        # pidfile='/var/run/tim_manager.pid'
        # run_once(test, pidfile)

